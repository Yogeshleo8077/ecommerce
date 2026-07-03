import { Response, Request } from 'express';
import { Order } from '../models/order.model';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID || 'dummy_id',
  key_secret: env.RAZORPAY_KEY_SECRET || 'dummy_secret',
});

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderItems: frontendOrderItems, shippingAddress, paymentMethod } = req.body;
    const userId = req.user?.id;

    if (!frontendOrderItems || frontendOrderItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    // Map cart items to order items securely by fetching from DB
    const orderItems = [];
    for (const item of frontendOrderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        image: product.images[0],
        price: product.price, // Use price from DB to prevent frontend tampering
        color: item.color,
        size: item.size,
      });
    }

    const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const taxPrice = Number((itemsPrice * 0.15).toFixed(2)); // 15% tax to match frontend
    let shippingPrice = itemsPrice > 100 ? 0 : 10; // free shipping above 100 to match frontend
    if (paymentMethod === 'Cash On Delivery') {
      shippingPrice += 80;
    }
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    // --- RACE CONDITION HANDLING: Atomic Stock Deduction ---
    const deductedProducts = [];
    
    for (const item of orderItems) {
      // Find the product and ONLY update if stock >= quantity requested
      const product = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { returnDocument: 'after' }
      );
      
      if (!product) {
        // Rollback already deducted products (if any) because one item failed
        for (const deducted of deductedProducts) {
          await Product.updateOne(
            { _id: deducted.productId },
            { $inc: { stock: deducted.quantity } }
          );
        }
        return res.status(400).json({ 
          message: `Race condition detected: Insufficient stock for ${item.name}. Someone just bought the last item!` 
        });
      }
      
      deductedProducts.push({ productId: item.product, quantity: item.quantity });
    }
    // -------------------------------------------------------

    const order = new Order({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    await order.save();

    // Create Razorpay Order if payment method is Razorpay
    if (paymentMethod === 'Razorpay') {
      const options = {
        amount: Math.round(totalPrice * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: order._id.toString(),
      };
      
      const rpOrder = await razorpay.orders.create(options);
      order.razorpayOrderId = rpOrder.id;
      await order.save();
      
      // Clear the cart
      await Cart.findOneAndDelete({ user: userId });

      return res.status(201).json({
        message: 'Order created successfully',
        order,
        razorpayOrderId: rpOrder.id,
        amount: options.amount,
        currency: options.currency,
      });
    }

    // If not Razorpay (e.g., COD)
    await Cart.findOneAndDelete({ user: userId });
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    logger.error({ err: error }, 'Error in createOrder controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyRazorpayPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest("hex");
      
    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: razorpay_payment_id,
          status: 'success',
          update_time: new Date().toISOString(),
          email_address: req.user?.id || '',
        };
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.status = 'Processing';
        await order.save();
        
        return res.status(200).json({ message: 'Payment verified successfully', order });
      }
      return res.status(404).json({ message: 'Order not found' });
    } else {
      return res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (error) {
    logger.error({ err: error }, 'Error in verifyRazorpayPayment controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the user is the owner or an admin
    if (order.user._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.status(200).json({ order });
  } catch (error) {
    logger.error({ err: error }, 'Error in getOrderById controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?.id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    logger.error({ err: error }, 'Error in getUserOrders controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin only
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find().populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    logger.error({ err: error }, 'Error in getAllOrders controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin only
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    await order.save();
    res.status(200).json({ message: 'Order status updated', order });
  } catch (error) {
    logger.error({ err: error }, 'Error in updateOrderStatus controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};
