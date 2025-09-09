import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUsers, addUser, editUser, deleteUser } from "@/app/api/users";
import { toast } from "react-toastify";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUsers();
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch users");
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await addUser(userData);
      return response.data;
    } catch (error) {
      if (error.status === 400) {
        toast.error(error.response.data.message[0])};
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await editUser(id, data);
      return response.data;
    } catch (error) {
       if (error.status === 400) {
        toast.error(error.response.data.message)};
      return rejectWithValue(error.message);
    }
  }
);

export const removeUser = createAsyncThunk(
  "users/removeUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteUser(id);

      return response;
    } catch (error) {
      if (error.status === 400) {
        toast.error(error.response.data.message)};
      return rejectWithValue(error.message);
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    usersList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.usersList.findIndex(
          (user) => user._id === action.meta.arg.id
        );
        if (index !== -1) {
          state.usersList[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.usersList = state.usersList.filter(
          (user) => user._id !== action.meta.arg
        );
      })
      .addCase(removeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
