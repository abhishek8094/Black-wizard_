"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAnnouncementVisible, setAnnouncementVisible } from "../redux/slices/announcementSlice";

export default function AnnouncementBar() {
  const isVisible = useSelector(selectAnnouncementVisible);
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Debug: Always show announcement for now
  // if (!isVisible) return null;

  const handleDismiss = () => dispatch(setAnnouncementVisible(false));
  


  const announcements = [
    "BUY ANY 4 PRODUCTS AND GET 15% OFF",
    "FREE SHIPPING ON ORDER OVER ₹1000",
    "FREE SHIPPING ON PREPAID ORDER"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-red-600 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Rotating announcements */}
        <div className="flex-1 text-center">
          <div className="text-sm font-medium text-white transition-opacity duration-500">
            <strong>{announcements[currentIndex]}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex-shrink-0 rounded-md p-1 hover:bg-white/20 focus:outline-none transition-colors"
            onClick={handleDismiss}
            aria-label="Dismiss announcement"
          >
            <svg
              className="h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
