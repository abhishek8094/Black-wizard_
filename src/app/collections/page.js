"use client";
import React, { useState, useEffect, Suspense } from "react";
import {
  FiChevronRight,
  FiGrid,
  FiList,
  FiArrowLeft,
  FiArrowRight,
  FiHome,
  FiFilter,
} from "react-icons/fi";
import { categories } from "../constant/constant";
import { allProducts } from "../constant/constant";
import Link from "next/link";
import Image from "next/image";

import { useSearchParams } from "next/navigation";
import { generateProductSlug } from "../utils/slugify";

// Component that uses useSearchParams - to be wrapped in Suspense
const CollectionsContent = () => {
  const searchParams = useSearchParams();
  const category = searchParams?.get("category");

  const [products, setProducts] = useState(allProducts);

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortBy, setSortBy] = useState("best-selling");
  const [layout, setLayout] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 800]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productsPerPage = 8;

  useEffect(() => {
    let filtered = allProducts;
    if (category) {
      filtered = allProducts.filter((product) => product.category === category);
    }

    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
    let result = [...filtered];

    switch (sortBy) {
      case "price-ascending":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-descending":
        result.sort((a, b) => b.price - a.price);
        break;
      case "title-ascending":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-descending":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [category, sortBy, priceRange]);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <header className="py-6 md:py-8 lg:pt-12 lg:pb-8 relative">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-800 mb-3 md:mb-4">
            {category}
          </h1>

          {/* Breadcrumbs */}
          <nav
            className="text-gray-400 text-xs sm:text-sm mb-6 md:mb-12"
            aria-label="Breadcrumb"
          >
            <ol className="flex justify-center items-center space-x-1 sm:space-x-2">
              <li>
                <Link href="/" className="flex items-center text-gray-600 font-bold">
                  <FiHome className="mr-1 text-sm" /> Home
                </Link>
              </li>
              <li>
                <FiChevronRight className="text-xs" />
              </li>
              <li className="text-gray-600">{category}</li>
            </ol>
          </nav>

          {/* Category Navigation */}
          <div className="overflow-x-auto py-2">
            <div className="flex space-x-4 sm:space-x-6 md:space-x-8 justify-start sm:justify-center whitespace-nowrap px-2">
              {categories.map((cat, index) => (
                <Link
                  key={index}
                  href={`?category=${encodeURIComponent(cat)}`}
                  className={`text-xs sm:text-sm transition-colors duration-200 px-2 py-1 ${
                    category === cat
                      ? "font-semibold text-gray-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-500 hover:text-gray-600"
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4">
        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-3 sm:gap-4">
          <div className="flex items-center justify-between w-full space-x-2 sm:space-x-4">
            <button
              className="flex items-center space-x-1 sm:space-x-2 cursor-pointer px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <FiFilter size={16} className="sm:size-[18px]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-3 text-gray-800">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <button
                  className={`p-1 sm:p-2 rounded ${
                    layout === "grid" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setLayout("grid")}
                  aria-label="Grid view"
                >
                  <FiGrid size={16} className="sm:size-[18px]" />
                </button>
                <button
                  className={`p-1 sm:p-2 rounded ${
                    layout === "list" ? "bg-gray-200" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setLayout("list")}
                  aria-label="List view"
                >
                  <FiList size={16} className="sm:size-[18px]" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  className="py-1 sm:py-2 pl-2 sm:pl-3 pr-8 sm:pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="best-selling">Best selling</option>
                  <option value="title-ascending">Alphabetically, A-Z</option>
                  <option value="title-descending">Alphabetically, Z-A</option>
                  <option value="price-ascending">Price, low to high</option>
                  <option value="price-descending">Price, high to low</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {showMobileFilters && (
          <div
            className="fixed inset-0 bg-black text-gray-800 bg-opacity-50 z-40 "
            onClick={() => setShowMobileFilters(false)}
          >
            <div
              className="absolute left-0 top-0 h-full w-80 bg-white transform transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <PriceFilter
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
                  : "space-y-4 sm:space-y-6"
              }
            >
              {currentProducts.map((product) => (
                <ProductCard
                  slug={generateProductSlug(product.title)}
                  key={product.id}
                  product={product}
                  layout={layout}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 sm:mt-12 flex justify-center">
                <nav className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-1 sm:p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <FiArrowLeft size={14} className="sm:size-[16px]" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md text-sm sm:text-base ${
                          currentPage === number
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-1 sm:p-2 rounded-md border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <FiArrowRight size={14} className="sm:size-[16px]" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Price Filter Component
const PriceFilter = ({ priceRange, setPriceRange }) => {
  const handleMinChange = (e) => {
    const value = Math.max(0, Math.min(800, parseInt(e.target.value) || 0));
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(0, Math.min(800, parseInt(e.target.value) || 800));
    setPriceRange([priceRange[0], value]);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>

      {/* Range Slider */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="800"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange([priceRange[0], parseInt(e.target.value)])
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
              (priceRange[0] / 800) * 100
            }%, #e5e7eb ${(priceRange[0] / 800) * 100}%, #e5e7eb ${
              (priceRange[1] / 800) * 100
            }%, #3b82f6 ${(priceRange[1] / 800) * 100}%, #3b82f6 100%)`,
          }}
        />
      </div>

      {/* Price Inputs */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Min Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              Rs.
            </span>
            <input
              type="number"
              min="0"
              max="800"
              value={priceRange[0]}
              onChange={handleMinChange}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              Rs.
            </span>
            <input
              type="number"
              min="0"
              max="800"
              value={priceRange[1]}
              onChange={handleMaxChange}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Price Display */}
      <div className="mt-3 text-center text-sm text-gray-600">
        Rs. {priceRange[0]} - Rs. {priceRange[1]}
      </div>
    </div>
  );
};

const ProductCard = ({ product, layout, slug }) => {
  return (
    <Link href={`/collections/products/${slug}`}>
      <div
        className={`bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
          layout === "list" 
            ? "flex flex-col sm:flex-row mb-6" 
            : "mb-6 sm:mb-10"
        }`}
      >
        <div
          className={`relative ${
            layout === "list" 
              ? "w-full sm:w-1/3 aspect-w-2 aspect-h-3" 
              : "aspect-w-2 aspect-h-3"
          }`}
        >
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={500}
            quality={100}
            className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover"
          />
        </div>
        <div className={`p-3 sm:p-4 ${layout === "list" ? "w-full sm:w-2/3" : ""}`}>
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1 text-sm sm:text-base">
            {product.title}
          </h3>

          <div className="mb-2 sm:mb-3">
            <span className="text-base sm:text-lg font-semibold text-gray-900">
              Rs. {product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Main Collections component with Suspense boundary
const Collections = () => {
  return (
    <Suspense fallback={<CollectionsLoading />}>
      <CollectionsContent />
    </Suspense>
  );
};

// Loading component for Suspense fallback
const CollectionsLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading collections...</p>
      </div>
    </div>
  );
};

export default Collections;
