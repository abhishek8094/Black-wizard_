'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const AnnouncementContext = createContext({
  isVisible: true,
  setIsVisible: () => {},
});

export function useAnnouncement() {
  return useContext(AnnouncementContext);
}

export function AnnouncementProvider({ children }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDismissed = sessionStorage.getItem('announcementDismissed');
      if (isDismissed) {
        setIsVisible(false);
      }
    }
  }, []);

  const handleSetVisible = (visible) => {
    setIsVisible(visible);
    if (!visible && typeof window !== 'undefined') {
      sessionStorage.setItem('announcementDismissed', 'true');
    }
  };

  return (
    <AnnouncementContext.Provider value={{ isVisible, setIsVisible: handleSetVisible }}>
      {children}
    </AnnouncementContext.Provider>
  );
}
