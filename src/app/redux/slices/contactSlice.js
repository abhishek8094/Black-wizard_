import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getContacts, addContact, editContact, deleteContact } from "@/app/api/contacts";
import { toast } from "react-toastify";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getContacts();
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch contacts");
      return rejectWithValue(error.message);
    }
  }
);

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await addContact(contactData);
      return response.data;
    } catch (error) {
      if (error.status === 400) {
        toast.error(error.response.data.message[0]);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await editContact(id, data);
      return response.data;
    } catch (error) {
       if (error.status === 400) {
        toast.error(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

export const removeContact = createAsyncThunk(
  "contacts/removeContact",
  async (id, { rejectWithValue }) => {
    try {
      const response = await deleteContact(id);
      return response;
    } catch (error) {
      if (error.status === 400) {
        toast.error(error.response.data.message);
      }
      return rejectWithValue(error.message);
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contactsList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contactsList = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contactsList.push(action.payload);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.contactsList.findIndex(
          (contact) => contact._id === action.meta.arg.id
        );
        if (index !== -1) {
          state.contactsList[index] = action.payload;
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeContact.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeContact.fulfilled, (state, action) => {
        state.loading = false;
        state.contactsList = state.contactsList.filter(
          (contact) => contact._id !== action.meta.arg
        );
      })
      .addCase(removeContact.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default contactSlice.reducer;
