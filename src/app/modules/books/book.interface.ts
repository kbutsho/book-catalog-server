import { Model, ObjectId } from 'mongoose';

export type IBook = {
  title: string;
  author: string;
  genre: string;
  publicationDate: Date;
  userId: ObjectId;
  image: string
}

export type BookModel = Model<IBook, Record<string, unknown>>;
export type IBookFilters = { searchTerm?: string };
