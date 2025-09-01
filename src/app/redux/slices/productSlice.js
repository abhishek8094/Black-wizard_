const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import { getRequest } from "@/app/api/auth";

const API_ENDPOINTS = {
  EXPLORE_COLLECTION: "/explore",
  CAROUSEL: "/carousel",
  TRENDING_PRODUCT: "/trending",
};

export const getCrousel = createAsyncThunk(
  "product/getCrousel",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.CAROUSEL);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch community data"
      );
    }
  }
);

export const exploreCollection = createAsyncThunk(
  "product/exploreCollection",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.EXPLORE_COLLECTION);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch community data"
      );
    }
  }
);

export const trendingProduct = createAsyncThunk(
  "product/trendingProduct",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.TRENDING_PRODUCT);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch community data"
      );
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    exploreData: null,
    carouselData: null,
    trendingProductData: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(exploreCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(exploreCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.exploreData = action.payload;
      })
      .addCase(exploreCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCrousel.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCrousel.fulfilled, (state, action) => {
        state.loading = false;
        state.carouselData = action.payload;
      })
      .addCase(getCrousel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(trendingProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(trendingProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.carouselData = action.payload;
      })
      .addCase(trendingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
