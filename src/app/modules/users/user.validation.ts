import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'name is required!'
    }),
    email: z.string({
      required_error: 'email is required!'
    }),
    password: z.string({
      required_error: 'password is required!'
    })
  })
});

export const UserValidation = {
  createUserZodSchema
};
