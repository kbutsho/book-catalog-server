import express from 'express';
import validateRequest from '../../middleware/validationRequest';
import { BookValidation } from './book.validation';
import { BookController } from './book.controller';

const router = express.Router();

router.get('/genre', BookController.getAllGenre)
router.get('/publication-date', BookController.getPublicationDateRange)
router.post('/', validateRequest(BookValidation.createBookZodSchema), BookController.createBook);
router.get('/:id', BookController.getSingleBook);
router.patch('/:id', validateRequest(BookValidation.updateBookZodSchema), BookController.updateBook);
router.delete('/:id', BookController.deleteBook)

router.get('/', BookController.getAllBook)

export const BookRoutes = router;
