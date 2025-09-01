'use client';

import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import { ReduxProvider } from './redux/slices/provider';

export function Providers({ children }) {
  return (
    <ReduxProvider>
      <CartProvider>
        <WishlistProvider>
          <AnnouncementProvider>
            {children}
          </AnnouncementProvider>
        </WishlistProvider>
      </CartProvider>
    </ReduxProvider>
  );
}
