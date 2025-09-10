const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import { getRequestWithToken, postRequestWithToken } from "@/app/api/auth";
import { toast } from "react-toastify";

const API_ENDPOINTS = {
  ADD: "/orders/add",
  ORDERS: "/orders",
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(API_ENDPOINTS.ORDERS);
      return response;
    } catch (error) {
      console.error(
        "Fetch Orders Error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const addOrder = createAsyncThunk(
  "orders/createOrder",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.ADD, data);
      return response;
    } catch (error) {
      console.error(
        "Create Order Error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to add order");
      return rejectWithValue(
        error.response?.data?.message || "Failed to add order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload); 
        state.error = null;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrders } = orderSlice.actions;
export default orderSlice.reducer;
