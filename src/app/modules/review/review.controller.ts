import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../../shared/catch.async";
import { BookService } from "../books/book.service";
import sendResponse from "../../../shared/response.send";
import { IReview } from "./review.interface";
import httpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.create(req.body);
  sendResponse<IReview>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'review added successfully!',
    data: result,
  });
});

const getAllReview: RequestHandler = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await reviewService.getAllReview(id);
  sendResponse<IReview[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `review retrieved successfully!`,
    data: result
  });
})

export const reviewController = { createReview, getAllReview }