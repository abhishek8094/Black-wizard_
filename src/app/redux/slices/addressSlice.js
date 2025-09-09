import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getRequestWithToken,
  postRequestWithToken,
} from "@/app/api/auth";
import { toast } from "react-toastify";

const API_ENDPOINT = "/addresses";

export const fetchAddresses = createAsyncThunk(
  "address/fetchAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestWithToken(API_ENDPOINT);
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to fetch addresses");
      return rejectWithValue(error.message);
    }
  }
);

export const addAddress = createAsyncThunk(
  "address/addAddress",
  async (addressData, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINT, addressData);
      toast.success("Address added successfully");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to add address");
      return rejectWithValue(error.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  "address/updateAddress",
  async ({ id, addressData }, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINT}/${id}`, addressData);
      toast.success("Address updated successfully");
      return response;
    } catch (error) {
      toast.error(error.message || "Failed to update address");
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "address/deleteAddress",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINT}/${id}/delete`);
      toast.success("Address deleted successfully");
      return { id };
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
      return rejectWithValue(error.message);
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState: {
    addressesData: { data: [] },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addressesData = action.payload;
        state.error = null;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addressesData.data.push(action.payload);
        state.error = null;
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.addressesData.data.findIndex(addr => addr._id === action.payload._id);
        if (index !== -1) {
          state.addressesData.data[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.loading = false;
        state.addressesData.data = state.addressesData.data.filter(addr => addr._id !== action.payload.id);
        state.error = null;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default addressSlice.reducer;
