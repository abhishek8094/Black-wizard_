"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { generateProductSlug } from "@/app/utils/slugify";
import Image from "next/image";
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

  // 🔹 Create dynamic categories from exploreData
  const categories = useMemo(() => {
    if (!Array.isArray(exploreData) || exploreData.length === 0) return [];

    const uniqueCategories = new Set();
    exploreData.forEach((product) => {
      if (product.category) {
        uniqueCategories.add(product.category);
      }
    });

    return [
      { id: "all", name: "All" },
      ...Array.from(uniqueCategories).map((cat) => ({
        id: cat.toLowerCase().replace(/\s+/g, "-"), // safe ID
        name: cat,
      })),
    ];
  }, [exploreData]);

  // 🔹 Filter products based on selected category
  const filteredProducts = !Array.isArray(exploreData) ? [] : (
    activeCategory === "all"
      ? exploreData
      : exploreData.filter(
          (product) =>
            product.category?.toLowerCase().replace(/\s+/g, "-") ===
            activeCategory
        )
  );

  const handleProductClick = (product) => {
    const slug = generateProductSlug(product.name);
    router.push(`/collections/products/${slug}`);
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
        {categories.map((category) => (
          <button
            key={category.id}
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
        {filteredProducts?.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer"
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            onClick={() => handleProductClick(product)}
          >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                className="w-full aspect square object-cover transition-transform duration-300 group-hover:scale-105"
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                quality={100}
              />
              {product.tag && (
                <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                  {product.tag}
                </span>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                {product.name}
              </h3>

              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xl font-bold text-gray-900">
                    Rs. {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      Rs. {product.originalPrice}
                    </span>
                  )}
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
