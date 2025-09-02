'use client';

import { ReduxProvider } from './redux/slices/provider';

export function Providers({ children }) {
  return (
    <ReduxProvider>
      {children}
    </ReduxProvider>
  );
}
