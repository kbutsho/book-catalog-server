import { Model } from "mongoose";

export type IReview = {
  bookId: string;
  userId: string;
  comment: string;
}

export type ReviewModel = Model<IReview, Record<string, unknown>>;