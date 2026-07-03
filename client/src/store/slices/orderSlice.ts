import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export interface Order {
  _id: string;
  user: string;
  orderItems: {
    name: string;
    quantity: number;
    image: string;
    price: number;
    product: string;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
  razorpayOrderId?: string;
}

interface OrderState {
  order: Order | null;
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  isLoading: false,
  error: null,
  success: false,
};

// Create Order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (order: any, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/orders', order);
      return data.order;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Get Order Details
export const getOrderDetails = createAsyncThunk(
  'order/getOrderDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Pay Order
export const payOrder = createAsyncThunk(
  'order/payOrder',
  async (paymentResult: any, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/orders/verify-payment`, paymentResult);
      return data.order;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);
// Get My Orders
export const getMyOrders = createAsyncThunk(
  'order/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/myorders`);
      return data.orders;
    } catch (error: any) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    orderReset: (state) => {
      state.order = null;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // createOrder
    builder.addCase(createOrder.pending, (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.order = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // getOrderDetails
    builder.addCase(getOrderDetails.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.order = action.payload;
    });
    builder.addCase(getOrderDetails.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // payOrder
    builder.addCase(payOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(payOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = true;
      state.order = action.payload;
    });
    builder.addCase(payOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // getMyOrders
    builder.addCase(getMyOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getMyOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(getMyOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export const { orderReset } = orderSlice.actions;
export default orderSlice.reducer;
