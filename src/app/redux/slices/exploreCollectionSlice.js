const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import { getRequest, postRequestWithToken } from "@/app/api/auth";

const API_ENDPOINTS = {
  EXPLORE_COLLECTION: "/explore"
};

export const exploreCollection = createAsyncThunk(
  "exploreCollection/exploreCollection",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.EXPLORE_COLLECTION);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch explore collection data"
      );
    }
  }
);

export const addExploreCollection = createAsyncThunk(
  "exploreCollection/addExploreCollection",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.EXPLORE_COLLECTION, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add explore Collection");
    }
  }
);

export const updateExploreCollection = createAsyncThunk(
  "exploreCollection/updateExploreCollection",
  async (formData, { rejectWithValue }) => {
    try {
      const id = formData.get('id');
      formData.delete('id');
      const response = await postRequestWithToken(`${API_ENDPOINTS.EXPLORE_COLLECTION}/update/${id}`, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update explore Collection");
    }
  }
);

export const deleteExploreCollection = createAsyncThunk(
  "exploreCollection/deleteExploreCollection",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINTS.EXPLORE_COLLECTION}/delete/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete explore Collection");
    }
  }
);

const exploreCollectionSlice = createSlice({
  name: "exploreCollection",
  initialState: {
    exploreData: null,
    loading: false,
    error: null
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
      .addCase(addExploreCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(addExploreCollection.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addExploreCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateExploreCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateExploreCollection.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateExploreCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteExploreCollection.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteExploreCollection.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteExploreCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default exploreCollectionSlice.reducer;
