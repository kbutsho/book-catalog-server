import { z } from 'zod';

const createBookZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: 'title is required!',
    }),
    author: z.string({
      required_error: 'author is required!',
    }),
    genre: z.string({
      required_error: 'genre is required!',
    }),
    publicationDate: z.string({
      required_error: 'publication date is required!',
    }),
    image: z.string({
      required_error: 'string is required!',
    }),
    userId: z.string({
      required_error: 'userId is required!',
    })
  }),
});

const updateBookZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    author: z.string().optional(),
    genre: z.string().optional(),
    publicationDate: z.string().optional(),
    image: z.string().optional(),
    userId: z.string().optional()
  }),
});

export const BookValidation = {
  createBookZodSchema,
  updateBookZodSchema
};
