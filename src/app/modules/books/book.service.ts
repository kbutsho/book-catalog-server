import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { bookSearchableFields } from "./book.constant";
import { IBook, IBookFilters, IGenre, IPublicationDateRange } from "./book.interface";
import { Book } from "./book.model";
import ApiError from "../../../errorHandler/api.error";
import httpStatus from "http-status";

const create = async (data: IBook): Promise<IBook> => {
  const result = (await Book.create(data))
  return result;
}

const getAllBook = async (filters: IBookFilters, paginationOptions: IPaginationOptions): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, minPublicationDate, maxPublicationDate, genre, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } = paginationHelpers.calculatePagination(paginationOptions);
  const andConditions = [];
  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  if (maxPublicationDate) {
    andConditions.push({
      $expr: {
        $lte: [{ $year: { date: "$publicationDate" } }, parseInt(maxPublicationDate)]
      }
    });
  }
  if (minPublicationDate) {
    andConditions.push({
      $expr: {
        $gte: [{ $year: { date: "$publicationDate" } }, parseInt(minPublicationDate)]
      }
    });
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};
  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments();
  return {
    meta: { page, limit, total },
    data: result
  };
};

const getSingleBook = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id);
  return result;
};

const update = async (bookId: string, userId: string, data: Partial<IBook>): Promise<IBook | null> => {
  const isVerifiedUser = await Book.findOne({ userId: userId, _id: bookId });
  if (!isVerifiedUser) {
    throw new ApiError(httpStatus.FORBIDDEN, 'you are not authorized of this book!');
  }
  const result = await Book.findOneAndUpdate({ _id: bookId }, data, { new: true })
  return result;
};

const deleteBook = async (bookId: string, userId: string): Promise<IBook | null> => {
  const isVerifiedUser = await Book.findOne({ userId: userId });
  if (!isVerifiedUser) {
    throw new ApiError(httpStatus.FORBIDDEN, 'you are not authorized of this book!');
  }
  const result = await Book.findByIdAndDelete(bookId);
  return result;
};

const getAllGenre = async (): Promise<IGenre[] | []> => {
  const getAllGenre: IGenre[] | [] = await Book.distinct('genre');
  return getAllGenre;
}

const getBookPublicationRange = async (): Promise<number[] | []> => {
  const dateRange = await Book.aggregate([
    {
      $group: {
        _id: null,
        minPublicationYear: { $min: { $year: "$publicationDate" } },
        maxPublicationYear: { $max: { $year: "$publicationDate" } }
      }
    },
    {
      $project: {
        _id: 0,
        range: ["$minPublicationYear", "$maxPublicationYear"]
      }
    }
  ]);

  // 'dateRange' will be an array with a single object containing the range array.
  // If the collection is empty, the result will be an empty array.
  return dateRange[0]?.range || [];
};




export const BookService = {
  create,
  getAllBook,
  getSingleBook,
  update,
  deleteBook,
  getAllGenre,
  getBookPublicationRange
};