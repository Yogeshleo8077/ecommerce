import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator';

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

router.get('/', getCart);
router.post('/', validate(addToCartSchema), addToCart);
router.put('/:productId', validate(updateCartItemSchema), updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
