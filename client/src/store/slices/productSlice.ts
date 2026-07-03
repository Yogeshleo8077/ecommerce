import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/api';
import type { Product } from '../../components/ui/ProductCard';

interface ProductState {
  products: Product[];
  productDetails: Product | null;
  page: number;
  pages: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  productDetails: null,
  page: 1,
  pages: 1,
  isLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    { keyword = '', pageNumber = '', category = '', brand = '', minPrice = '', maxPrice = '', sort = '' }:
    { keyword?: string; pageNumber?: string | number; category?: string; brand?: string; minPrice?: string; maxPrice?: string; sort?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      if (keyword) params.append('search', keyword);
      if (pageNumber) params.append('page', String(pageNumber));
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      if (sort) params.append('sort', sort);

      const { data } = await api.get(`/products?${params.toString()}`);
      return data; // backend returns { products: [...], page: ..., pages: ... }
    } catch (error: any) {
      console.error('Fetch products error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.product;
    } catch (error: any) {
      console.error('Fetch product error:', error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch product');
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action: PayloadAction<{ products: Product[], page: number, pages: number }>) => {
      state.isLoading = false;
      state.products = action.payload.products;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Fetch Product Details
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchProductDetails.fulfilled, (state, action: PayloadAction<Product>) => {
      state.isLoading = false;
      state.productDetails = action.payload;
    });
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  }
});

export default productSlice.reducer;
