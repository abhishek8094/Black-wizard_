"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCrousel } from "@/app/redux/slices/productSlice";

export default function CarouselPage() {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const data = useSelector((state) => state.product.carouselData);

  useEffect(() => {
    if (!isAutoPlay || !data?.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === data.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, data]);

  useEffect(() => {
    dispatch(getCrousel());
  }, [dispatch]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative w-full max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-lg shadow-2xl">
            <div className="relative h-96 md:h-[500px] lg:h-[600px]">
              {data?.length > 0 && (
                <img
                  src={data[currentIndex]?.imageUrl}
                  alt={`Slide ${currentIndex + 1}`}
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {data?.map((_, slideIndex) => (
                <button
                  key={slideIndex}
                  onClick={() => goToSlide(slideIndex)}
                  className={`w-3 h-3 rounded-full transition duration-300 ${
                    currentIndex === slideIndex
                      ? "bg-white"
                      : "bg-white bg-opacity-50"
                  }`}
                  aria-label={`Go to slide ${slideIndex + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
