const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import { getRequest, postRequestWithToken } from "@/app/api/auth";

const API_ENDPOINTS = {
  PRODUCTS: "/products",
  PRODUCTS_SEARCH: "/products/search",
  PRODUCT_CATEGORIES: "/categories",
  CAROUSEL: "/carousel",
  DELETE_CAROUSEL: "/carousel/delete",
  TRENDING_PRODUCT: "/trending",
  TRENDING_PRODUCT_DELETE: "/trending/delete"
};

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.PRODUCTS, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
  }
);

export const searchProduct = createAsyncThunk(
  "product/searchProduct",
  async (query, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.PRODUCTS_SEARCH}?q=${query}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const id = formData.get('id');
      formData.delete('id');
      const response = await postRequestWithToken(`${API_ENDPOINTS.PRODUCTS}/update/${id}`, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINTS.PRODUCTS}/delete/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete product");
    }
  }
);

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.PRODUCTS);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch community data"
      );
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await getRequest(`${API_ENDPOINTS.PRODUCTS}/${productId}`);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const productCategories = createAsyncThunk(
  "product/productCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequest(API_ENDPOINTS.PRODUCT_CATEGORIES);
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const addCategory = createAsyncThunk(
  "product/addCategory",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.PRODUCT_CATEGORIES, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add category");
    }
  }
);

export const updateCategory = createAsyncThunk(
  "product/updateCategory",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINTS.PRODUCT_CATEGORIES}/${id}/update`, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "product/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINTS.PRODUCT_CATEGORIES}/${id}/delete`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);

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

export const addCarouselItem = createAsyncThunk(
  "product/addCarouselItem",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.CAROUSEL, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add carousel item");
    }
  }
);

export const updateCarouselItem = createAsyncThunk(
  "product/updateCarouselItem",
  async (data, { rejectWithValue }) => {
    try {
      let id, payload;
      if (data instanceof FormData) {
        id = data.get('id');
        data.delete('id');
        payload = data;
      } else {
        id = data.id;
        payload = {   id:id, imageUrl: data.imageUrl };
      }
      const response = await postRequestWithToken(`${API_ENDPOINTS.CAROUSEL}/update`, payload);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update carousel item");
    }
  }
);

export const deleteCarouselItem = createAsyncThunk(
  "product/deleteCarouselItem",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.DELETE_CAROUSEL, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete carousel item");
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

export const addTrendingProduct = createAsyncThunk(
  "product/addTrendingProduct",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.TRENDING_PRODUCT, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add trending product");
    }
  }
);

export const updateTrendingProduct = createAsyncThunk(
  "product/updateTrendingProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const id = formData.get('id');
      formData.delete('id');
      const response = await postRequestWithToken(`${API_ENDPOINTS.TRENDING_PRODUCT}/update/${id}`, formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update trending product");
    }
  }
);

export const deleteTrendingProduct = createAsyncThunk(
  "product/deleteTrendingProduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINTS.TRENDING_PRODUCT_DELETE}/${id}`);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete trending product");
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    carouselData: null,
    trendingProductData: null,
    productCategorieData: null,
    productsData:null,
    productData: null,
    loading: false,
    error: null,
    searchProduct:null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.productsData = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(productCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(productCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.productCategorieData = action.payload;
      })
      .addCase(productCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally refresh categories after adding
        if (state.productCategorieData) {
          state.productCategorieData = [...state.productCategorieData, action.payload];
        }
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the category in the list
        if (state.productCategorieData) {
          const index = state.productCategorieData.findIndex(cat => cat.id === action.payload.id);
          if (index !== -1) {
            state.productCategorieData[index] = action.payload;
          }
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally remove the category from the list
        if (state.productCategorieData) {
          state.productCategorieData = state.productCategorieData.filter(cat => cat.id !== action.meta.arg);
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
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
        state.trendingProductData = action.payload;
      })
      .addCase(trendingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productData = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCarouselItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCarouselItem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addCarouselItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCarouselItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCarouselItem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCarouselItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteCarouselItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCarouselItem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteCarouselItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTrendingProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTrendingProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addTrendingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTrendingProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTrendingProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateTrendingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTrendingProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTrendingProduct.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteTrendingProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.searchProduct = action.payload
      })
      .addCase(searchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      
  },
});

export default productSlice.reducer;
