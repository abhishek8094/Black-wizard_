import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import announcementReducer from "./slices/announcementSlice";
import usersReducer from "./slices/usersSlice";
import addressReducer from "./slices/addressSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "product", "cart", "wishlist", "announcement"], // persist these slices
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedProductReducer = persistReducer(persistConfig, productReducer);
const persistedCartReducer = persistReducer(persistConfig, cartReducer);
const persistedWishlistReducer = persistReducer(persistConfig, wishlistReducer);
const persistedAnnouncementReducer = persistReducer(persistConfig, announcementReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    product: persistedProductReducer,
    cart: persistedCartReducer,
    wishlist: persistedWishlistReducer,
    announcement: persistedAnnouncementReducer,
    users: usersReducer,
    address: addressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
