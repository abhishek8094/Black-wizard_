import { createSlice } from "@reduxjs/toolkit";

const loadWishlistFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const storedWishlist = localStorage.getItem("wishlist");
    return storedWishlist ? JSON.parse(storedWishlist) : [];
  }
  return [];
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadWishlistFromLocalStorage(),
  },
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);
      if (!existingItem) {
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.items.length;
export const selectIsInWishlist = (state, productId) =>
  state.wishlist.items.some((item) => item.id === productId);

export default wishlistSlice.reducer;
