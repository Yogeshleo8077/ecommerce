import express from 'express';
import { createReview, getProductReviews } from '../controllers/review.controller';
import { authenticate } from '../middleware/auth.middleware';
import { z } from 'zod';
import { validate } from '../middleware/validate.middleware';

const router = express.Router();

const reviewSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    rating: z.number().min(1).max(5),
    comment: z.string().min(3, 'Comment must be at least 3 characters'),
  }),
});

router.post('/', authenticate, validate(reviewSchema), createReview);
router.get('/:productId', getProductReviews);

export default router;
