"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { exploreCollection } from "@/app/redux/slices/exploreCollectionSlice";
import Link from "next/link";

const ExploreCollection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { exploreData } = useSelector((state) => state.exploreCollection);

  useEffect(() => {
    dispatch(exploreCollection());
  }, [dispatch]);

  const categories = useMemo(() => {
    if (!exploreData || typeof exploreData !== "object") return [];

    return [
      { id: "all", name: "All" },
      ...Object.keys(exploreData)
        .filter((cat) => cat !== "All")
        .map((cat) => ({
          id: cat.toLowerCase().replace(/\s+/g, "-"),
          name: cat,
        })),
    ];
  }, [exploreData]);

  // 🔹 Products based on category
  const filteredProducts = useMemo(() => {
    if (!exploreData || typeof exploreData !== "object") return [];

    if (activeCategory === "all") {
      return exploreData["All"] || [];
    }

    const categoryName = categories.find((c) => c.id === activeCategory)?.name;
    return exploreData[categoryName] || [];
  }, [exploreData, activeCategory, categories]);

  const handleProductClick = (id) => {
    router.push(`/collections/products/${id}`);
  };

  return (
    <div className="pt-4 pb-16 bg-white">
      {/* Section Heading */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Explore Collection
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Discover premium fitness wear for every workout
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 px-2 sm:px-4">
        {categories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(category.id)}
            className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2 sm:px-4 gap-4 sm:gap-6">
        {filteredProducts?.map((product, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => handleProductClick(product.id)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-gray-50">
              <img
                className="max-h-full max-w-full object-cover transition-transform duration-300 group-hover:scale-105"
                src={product.image}
                alt={product.title}
              />
            </div>

            {/* Product Info */}
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {product.title}
              </h3>

              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div>
                  <span className="text-lg sm:text-xl font-bold text-gray-900">
                    Rs. {product.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-10 sm:mt-12 px-4">
        <Link
          href="#"
          className="inline-flex items-center bg-gray-900 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm sm:text-base"
        >
          Shop All Products
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ExploreCollection;
