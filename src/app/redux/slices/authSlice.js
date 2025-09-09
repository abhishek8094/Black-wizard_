const { createAsyncThunk, createSlice } = require("@reduxjs/toolkit");
import {
  postRequestWithToken,
  getRequestWithTokenAndWithoutData,
} from "@/app/api/auth";
import { setToken } from "@/app/api/auth";
import { toast } from "react-toastify";

const API_ENDPOINTS = {
  APP_LOGIN: "/auth/login",
  USER_REGISTRATION: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgotpassword",
  RESET_PASSWORD: "/auth/resetpassword",
  LOG_OUT: "/auth/logout",
  ME: "/auth/me",
};

export const editProfile = createAsyncThunk(
  "auth/editMeProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await postRequestWithToken(API_ENDPOINTS.ME, data);
      return response;
    } catch (error) {
      toast.error(error.response.data.message);
      return rejectWithValue(errorMessage);
    }
  }
);

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
      toast.error(error.response.data.message);
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
      const response = await postRequestWithToken(
        `${API_ENDPOINTS.FORGOT_PASSWORD}?${localStorage.getItem(
          "resetToken"
        )}`,
        data
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
        `${API_ENDPOINTS.RESET_PASSWORD}/${localStorage.getItem("resetToken")}`,
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

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getRequestWithTokenAndWithoutData(
        API_ENDPOINTS.LOG_OUT
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
    editData: null,
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
        state.userData = action.payload;
        state.error = null;
        if (typeof window !== "undefined" && action.payload?.user) {
          const { email, firstName, lastName, role } = action.payload.user;
          localStorage.setItem("userProfile", JSON.stringify({ email, firstName, lastName, role }));
          localStorage.setItem("userRole", role);
        }
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
        state.authData = null;
        state.userData = null;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("userProfile");
          localStorage.removeItem("userRole");
        }
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.editData = action.payload;
        state.userData = action.payload;
        if (typeof window !== "undefined" && action.payload?.user) {
          const { email, firstName, lastName, role } = action.payload.user;
          localStorage.setItem("userProfile", JSON.stringify({ email, firstName, lastName, role }));
          localStorage.setItem("userRole", role);
        }
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
