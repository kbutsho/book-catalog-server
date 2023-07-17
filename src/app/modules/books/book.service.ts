import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../../helpers/paginationHelpers";
import { IGenericResponse } from "../../../interfaces/common";
import { IPaginationOptions } from "../../../interfaces/pagination";
import { bookSearchableFields } from "./book.constant";
import { IBook, IBookFilters } from "./book.interface";
import { Book } from "./book.model";
import ApiError from "../../../errorHandler/api.error";
import httpStatus from "http-status";

const create = async (data: IBook): Promise<IBook> => {
  const result = (await Book.create(data))
  return result;
}

const getAllBook = async (filters: IBookFilters, paginationOptions: IPaginationOptions): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters;
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

export const BookService = {
  create,
  getAllBook,
  getSingleBook,
  update,
  deleteBook
};