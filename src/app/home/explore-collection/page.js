"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { generateProductSlug } from "@/app/utils/slugify";
import { useDispatch, useSelector } from "react-redux";
import { exploreCollection } from "@/app/redux/slices/productSlice";

const ExploreCollection = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { exploreData } = useSelector((state) => state.product);

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
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Explore Collection
        </h2>
        <p className="text-gray-600">
          Discover premium fitness wear for every workout
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
        {categories.map((category, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 gap-6">
        {filteredProducts?.map((product, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => handleProductClick(product.id)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <img
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                src={product.image}
                alt={product.title}
                width={500}
                height={500}
                quality={100}
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {product.title}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    Rs. {product.price}
                  </span>
                 
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12">
        <a
          href="/products"
          className="inline-flex items-center bg-gray-900 text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
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
        </a>
      </div>
    </div>
  );
};

export default ExploreCollection;
