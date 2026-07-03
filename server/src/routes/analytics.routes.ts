import express from 'express';
import { getDashboardStats } from '../controllers/analytics.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';

const router = express.Router();

router.get('/dashboard', authenticate, authorize(UserRole.ADMIN), getDashboardStats);

export default router;
