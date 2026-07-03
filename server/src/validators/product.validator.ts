import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Product name is required'),
    description: z.string().min(10, 'Product description is required'),
    price: z.coerce.number().min(0, 'Product price is required'),
    category: z.string().min(2, 'Product category is required'),
    brand: z.string().optional(),
    stock: z.coerce.number().min(0).optional(),
    // colors and sizes might come as comma-separated strings or JSON arrays in form-data.
    // For simplicity, we won't strictly validate them as arrays here if they are complex.
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    price: z.coerce.number().min(0).optional(),
    category: z.string().min(2).optional(),
    brand: z.string().optional(),
    stock: z.coerce.number().min(0).optional(),
  }),
});
