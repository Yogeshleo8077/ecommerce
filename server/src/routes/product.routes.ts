import express from 'express';
import {
  createProduct,
  getProducts,
  getFilters,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRole } from '../models/user.model';
import { createProductSchema, updateProductSchema } from '../validators/product.validator';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/filters', getFilters);
router.get('/:id', getProductById);

// Protected routes (Admin only)
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMIN),
  upload.array('images', 5), // allow up to 5 images
  validate(createProductSchema),
  createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMIN),
  upload.array('images', 5),
  validate(updateProductSchema),
  updateProduct
);

router.delete('/:id', authenticate, authorize(UserRole.ADMIN), deleteProduct);

export default router;
