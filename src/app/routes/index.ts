import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BookRoutes } from '../modules/books/book.route';
import { ReviewRoutes } from '../modules/review/review.route';

const router = express.Router();
const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  }
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
