import { Request, Response } from 'express';
import { Product } from '../models/product.model';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth.middleware';
import { getCache, setCache, deleteCache } from '../utils/cache';
import { uploadImageToCloudinary } from '../config/cloudinary';

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const productData = { ...req.body, createdBy: req.user?.id };
    
    // Process image uploads if files exist
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadImageToCloudinary(file.buffer));
      const imageUrls = await Promise.all(uploadPromises);
      productData.images = imageUrls;
    } else {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Parse arrays that might come as strings from form-data
    if (typeof productData.colors === 'string') productData.colors = productData.colors.split(',').map((c: string) => c.trim());
    if (typeof productData.sizes === 'string') productData.sizes = productData.sizes.split(',').map((s: string) => s.trim());

    const product = new Product(productData);
    await product.save();
    
    // Invalidate product caches
    await deleteCache('products:*');
    
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (error) {
    logger.error({ err: error }, 'Error in createProduct controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const cacheKey = `products:${req.originalUrl}`;
    const cachedData = await getCache(cacheKey);
    
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    const { category, brand, search, sort, minPrice, maxPrice, limit = 10, page = 1 } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const sortOption: any = {};
    if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price_desc') sortOption.price = -1;
    else sortOption.createdAt = -1; // default

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'firstName lastName email');

    const total = await Product.countDocuments(query);

    const responseData = {
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    };

    await setCache(cacheKey, responseData, 300); // Cache for 5 mins

    res.status(200).json(responseData);
  } catch (error) {
    logger.error({ err: error }, 'Error in getProducts controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getFilters = async (req: Request, res: Response) => {
  try {
    const cacheKey = 'products:filters';
    const cachedFilters = await getCache(cacheKey);

    if (cachedFilters) {
      return res.status(200).json(cachedFilters);
    }

    const categories = await Product.distinct('category');
    // Filter out null/empty brands just in case
    const brands = await Product.distinct('brand', { brand: { $nin: [null, ''] } });

    const filters = { categories, brands };
    await setCache(cacheKey, filters, 3600); // Cache for 1 hour

    res.status(200).json(filters);
  } catch (error) {
    logger.error({ err: error }, 'Error in getFilters controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const cacheKey = `product:${req.params.id}`;
    const cachedProduct = await getCache(cacheKey);

    if (cachedProduct) {
      return res.status(200).json({ product: cachedProduct });
    }

    const product = await Product.findById(req.params.id).populate('createdBy', 'firstName lastName email');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await setCache(cacheKey, product, 300); // Cache for 5 mins
    
    res.status(200).json({ product });
  } catch (error) {
    logger.error({ err: error }, 'Error in getProductById controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const updateData = { ...req.body };

    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const uploadPromises = req.files.map(file => uploadImageToCloudinary(file.buffer));
      const imageUrls = await Promise.all(uploadPromises);
      updateData.images = imageUrls; // overwrite or append depending on requirements, here overwrite
    }

    if (typeof updateData.colors === 'string') updateData.colors = updateData.colors.split(',').map((c: string) => c.trim());
    if (typeof updateData.sizes === 'string') updateData.sizes = updateData.sizes.split(',').map((s: string) => s.trim());

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Invalidate caches
    await deleteCache('products:*');
    await deleteCache(`product:${req.params.id}`);

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    logger.error({ err: error }, 'Error in updateProduct controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Invalidate caches
    await deleteCache('products:*');
    await deleteCache(`product:${req.params.id}`);

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error({ err: error }, 'Error in deleteProduct controller:');
    res.status(500).json({ message: 'Internal server error' });
  }
};
