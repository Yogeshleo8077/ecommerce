import { Request, Response } from 'express';
import { Review } from '../models/review.model';
import { Product } from '../models/product.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { rating, comment, productId } = req.body;
    const userId = req.user?.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already reviewed
    const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = new Review({
      rating,
      comment,
      product: productId,
      user: userId,
    });

    await review.save();

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    logger.error({ err: error }, 'Error in createReview controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    logger.error({ err: error }, 'Error in getProductReviews controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};
