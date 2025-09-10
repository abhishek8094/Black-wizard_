"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { trendingProducts } from "@/app/constant/constant";
import { generateProductSlug } from "@/app/utils/slugify";
import { useDispatch } from "react-redux";
import { trendingProduct } from "@/app/redux/slices/productSlice";
import { useSelector } from "react-redux";

export default function TrendingProducts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {trendingProductData} = useSelector((state)=>state.product);

  useEffect(() => {
    dispatch(trendingProduct());
  }, [dispatch]);

  const handleProductClick = (id) => {
    router.push(`/collections/products/${id}`);
  };
  return (
    <section className="pt-40 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trending Right Now
          </h2>
          <p className="text-lg text-gray-600">
            Discover what's hot in fitness fashion
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProductData?.map((product,idx) => (
            <div
              key={idx}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Product Images */}
              <div
                className="relative w-full aspect-[3/4] overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <img
                  src={product.subImg}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                {/* Quick View Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center">
                  <button className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-gray-900">
                      Rs. {product.price}
                    </span>
                    
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <a
            href="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-gray-900 hover:bg-gray-800 transition-colors"
          >
            View All Products
            <svg
              className="ml-2 -mr-1 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
