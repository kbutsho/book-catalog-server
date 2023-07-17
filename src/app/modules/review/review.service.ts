import { IReview } from "./review.interface";
import { Review } from "./review.model";

const create = async (data: IReview): Promise<IReview> => {
  const result = (await Review.create(data))
  return result;
}

const getAllReview = async (bookId: string): Promise<IReview[]> => {
  const result = Review.find({ bookId: bookId });
  return result;
};

export const reviewService = {
  create, getAllReview
}
