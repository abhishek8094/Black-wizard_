import { createSlice } from "@reduxjs/toolkit";

const loadAnnouncementFromStorage = () => {
  if (typeof window !== "undefined") {
    const isDismissed = sessionStorage.getItem("announcementDismissed");
    return !isDismissed; // true if not dismissed
  }
  return true;
};

const announcementSlice = createSlice({
  name: "announcement",
  initialState: {
    isVisible: loadAnnouncementFromStorage(),
  },
  reducers: {
    setAnnouncementVisible: (state, action) => {
      state.isVisible = action.payload;
      if (typeof window !== "undefined") {
        if (action.payload) {
          sessionStorage.removeItem("announcementDismissed");
        } else {
          sessionStorage.setItem("announcementDismissed", "true");
        }
      }
    },
  },
});

export const { setAnnouncementVisible } = announcementSlice.actions;

export const selectAnnouncementVisible = (state) => state.announcement.isVisible;

export default announcementSlice.reducer;
