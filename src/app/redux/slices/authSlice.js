const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import { postRequestWithToken, postRequestWithTokenAndWithoutData } from "@/app/api/auth";
import { setToken } from "@/app/api/auth";

const API_ENDPOINTS = {
  APP_LOGIN: "/auth/login",
  USER_REGISTRATION: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgotpassword",
  RESET_PASSWORD: "/auth/resetpassword",
  LOG_OUT: "/auth/logout",
};

export const userRegistration = createAsyncThunk(
  "auth/userRegistration",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.USER_REGISTRATION,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);

export const appLogin = createAsyncThunk(
  "auth/appLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.APP_LOGIN,
        data
      );

      console.log(response);

      const token = response.token || response.data?.token;

      setToken(token);
      if (response.statusCode === 409) {
        toast.error(
          response.message || "An unexpected error occurred. Please try again."
        );
      } else if (response.statusCode === 400) {
        toast.error(response.message);
      }

      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch auth data"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(`${API_ENDPOINTS.FORGOT_PASSWORD}?${localStorage.getItem("resetToken")}`,data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to update password"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(
        API_ENDPOINTS.RESET_PASSWORD,
        data
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  }
);

export const logout= createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await postRequestWithTokenAndWithoutData(
        API_ENDPOINTS.LOG_OUT,
      );
      return response;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(errorMessage);
    }
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState: {
    authData: null,
    userData: null,
    status: null,
    loading: false,
    error: null,
  },

  reducers: {
    setUser: (state, action) => {
      state.userData = action.payload;
    },
    clearAuth: (state) => {
      state.authData = null;
      state.userData = null;
      state.status = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(userRegistration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userRegistration.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload;
        state.error = null;
      })

      .addCase(userRegistration.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(appLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(appLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })

      .addCase(appLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.loading = false;
        state.authData = action.payload;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
