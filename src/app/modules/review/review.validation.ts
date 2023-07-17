import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    userId: z.string({
      required_error: 'userId is required!',
    }),
    bookId: z.string({
      required_error: 'bookId is required!',
    }),
    comment: z.string({
      required_error: 'comment is required!',
    })
  })
});

export const ReviewValidation = {
  createReviewZodSchema
};
