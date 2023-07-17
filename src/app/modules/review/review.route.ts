import express from 'express';
import validateRequest from '../../middleware/validationRequest';
import { ReviewValidation } from './review.validation';
import { reviewController } from './review.controller';


const router = express.Router();

router.post('/', validateRequest(ReviewValidation.createReviewZodSchema), reviewController.createReview);
router.get('/:id', reviewController.getAllReview);

export const ReviewRoutes = router;
