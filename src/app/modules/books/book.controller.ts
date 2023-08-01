import { Book } from './book.model';
import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catch.async";
import { BookService } from "./book.service";
import sendResponse from "../../../shared/response.send";
import { IBook, IGenre, IPublicationDateRange } from "./book.interface";
import httpStatus from "http-status";
import { bookFilterableFields } from "./book.constant";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constant/pagination";

const createBook: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.create(req.body);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book created successfully!',
    data: result,
  });
});

const getAllBook: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BookService.getAllBook(filters, paginationOptions);
  sendResponse<IBook[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${result.data.length} out of ${result.meta.total} books  retrieved successfully!`,
    meta: result.meta,
    data: result.data
  });
})

const getAllGenre: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getAllGenre();
  sendResponse<IGenre[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `genre found ${result.length}!`,
    data: result
  });
})

const getPublicationDateRange: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await BookService.getBookPublicationRange();
  sendResponse<IPublicationDateRange>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `publication date range found!`,
    data: result
  });
})

const getSingleBook = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BookService.getSingleBook(id);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Book fetched successfully!',
    data: result,
  });
});

const updateBook = catchAsync(async (req: Request, res: Response) => {
  const { id: bookId } = req.params;
  const { userId } = req.body;
  const result = await BookService.update(bookId, userId, req.body);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book updated successfully!',
    data: result,
  });
});

const deleteBook = catchAsync(async (req: Request, res: Response) => {
  const { id: cowId } = req.params;
  const { userId } = req.body;
  const result = await BookService.deleteBook(cowId, userId);
  sendResponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'book deleted successfully!',
    data: result,
  });
});

export const BookController = {
  createBook,
  getAllBook,
  getSingleBook,
  updateBook,
  deleteBook,
  getAllGenre,
  getPublicationDateRange
};
