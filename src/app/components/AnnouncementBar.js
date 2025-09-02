"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAnnouncementVisible, setAnnouncementVisible } from "../redux/slices/announcementSlice";

export default function AnnouncementBar() {
  const isVisible = useSelector(selectAnnouncementVisible);
  const dispatch = useDispatch();
  const carouselRef = useRef(null);
  const flickityInstance = useRef(null);

  if (!isVisible) return null;

  const handleDismiss = () => dispatch(setAnnouncementVisible(false));

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !carouselRef.current || flickityInstance.current) return;

    // Dynamically import Flickity only on client side
    import("flickity").then((Flickity) => {
      import("flickity/css/flickity.css");

      flickityInstance.current = new Flickity.default(carouselRef.current, {
        cellAlign: "center",
        wrapAround: true,
        autoPlay: 3000,
        pauseAutoPlayOnHover: true,
        prevNextButtons: false,
        pageDots: false,
      });
    });

    return () => {
      // Cleanup Flickity instance on unmount
      if (flickityInstance.current) {
        flickityInstance.current.destroy();
        flickityInstance.current = null;
      }
    };
  }, [isClient]);

  return (
    <div className="bg-red-600 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-3 py-2 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Flickity carousel container */}
        <div className="carousel flex-1" ref={carouselRef}>
          <div className="carousel-cell w-full text-sm font-medium text-white text-center">
            <strong>BUY ANY 4 PRODUCTS AND GET 15% OFF</strong>
          </div>
          <div className="carousel-cell w-full text-sm font-medium text-white text-center">
            <strong>FREE SHIPPING ON ORDER OVER ₹1000</strong>
          </div>
          <div className="carousel-cell w-full text-sm font-medium text-white text-center">
            <strong>FREE SHIPPING ON PREPAID ORDER</strong>
          </div>
        </div>

        <button
          type="button"
          className="ml-3 flex-shrink-0 rounded-md p-1 hover:bg-white/20 focus:outline-none transition-colors"
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
  );
}
