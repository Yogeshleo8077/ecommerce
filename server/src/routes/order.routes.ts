import express from 'express';
import {
  createOrder,
  verifyRazorpayPayment,
  getOrderById,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { UserRole } from '../models/user.model';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/order.validator';

const router = express.Router();

// All order routes require authentication
router.use(authenticate);

router.post('/', validate(createOrderSchema), createOrder);
router.post('/verify-payment', verifyRazorpayPayment);
router.get('/myorders', getUserOrders);
router.get('/:id', getOrderById);

// Admin routes
router.get('/', authorize(UserRole.ADMIN), getAllOrders);
router.put('/:id/status', authorize(UserRole.ADMIN), validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
