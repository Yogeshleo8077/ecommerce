import { Response } from 'express';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user?.id }).populate('items.product', 'name price images stock');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user?.id, items: [], totalPrice: 0 });
    }

    res.status(200).json({ cart });
  } catch (error) {
    logger.error({ err: error }, 'Error in getCart controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity, color, size } = req.body;
    const userId = req.user?.id;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check stock
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    // Check if the item is already in the cart with the same color and size
    const existingItemIndex = cart.items.findIndex(
      (item) => 
        item.product.toString() === productId &&
        item.color === color &&
        item.size === size
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check total stock again just in case
      if (product.stock < cart.items[existingItemIndex].quantity) {
        return res.status(400).json({ message: 'Not enough stock available for total quantity' });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        color,
        size
      });
    }

    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.status(200).json({ message: 'Item added to cart', cart });
  } catch (error) {
    logger.error({ err: error }, 'Error in addToCart controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Verify stock
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.status(200).json({ message: 'Cart updated', cart });
  } catch (error) {
    logger.error({ err: error }, 'Error in updateCartItem controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product', 'name price images stock');

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    logger.error({ err: error }, 'Error in removeFromCart controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }

    res.status(200).json({ message: 'Cart cleared successfully', cart });
  } catch (error) {
    logger.error({ err: error }, 'Error in clearCart controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};
