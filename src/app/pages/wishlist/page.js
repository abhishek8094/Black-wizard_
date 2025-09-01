"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart, items } = useCart();

  const handleAddToCart = (product) => {
    // Check if product is already in cart
    const existingItem = items.find(item => item.id === product.id);
    
    if (existingItem) {
      toast.error("Item already in the cart!");
      return;
    }
    
    addToCart(product);
    removeFromWishlist(product.id);
    toast.success("Item moved to cart successfully!");
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <FaHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add items you love to your wishlist to save them for later.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          My Wishlist ({wishlistItems.length} items)
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2  pb-8 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg border border-gray-400 overflow-hidden"
            >
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={300}
                  height={300}
                  className="w-full h-[400px] object-cover"
                />
                <button
                  onClick={() => {
                    removeFromWishlist(product.id);
                    toast.success("Item removed from the cart");
                  }}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Remove from wishlist"
                >
                  <FaTrash className="h-4 w-4 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {product.description}
                </p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  ₹{product.price}
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center"
                  >
                    <FaShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
