import { Schema, model } from 'mongoose';
import { IReview, ReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview>(
  {
    userId: {
      type: String,
      required: true,
    },
    bookId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    },
  }
);

export const Review = model<IReview, ReviewModel>('Review', reviewSchema);
