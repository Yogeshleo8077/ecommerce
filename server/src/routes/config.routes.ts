import express from 'express';
import { env } from '../config/env';

const router = express.Router();

router.get('/razorpay', (req, res) => {
  res.status(200).json({ key: env.RAZORPAY_KEY_ID || 'dummy_id' });
});

export default router;
