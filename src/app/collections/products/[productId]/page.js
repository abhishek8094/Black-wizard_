"use client";
import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiStar, FiTruck } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initiateRazorpayCheckout } from "@/app/utils/razorpay";
import { getProductById } from "@/app/redux/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectCartItems, addToCart } from "@/app/redux/slices/cartSlice";
import { FaRulerHorizontal } from "react-icons/fa";
import {
  selectWishlistItems,
  addToWishlist,
  removeFromWishlist,
} from "@/app/redux/slices/wishlistSlice";

export default function ProductDetailPage({ params }) {
  const dispatch = useDispatch();
  const unwrappedParams = React.use(params);
  const { productId } = unwrappedParams;
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const { productData } = useSelector((state) => state.product);
  const cartItems = useSelector(selectCartItems);
  const wishlistItems = useSelector(selectWishlistItems);

  useEffect(() => {
    dispatch(getProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (productData) {
      setSelectedSize(productData.size ? productData.size[0] : "");
      setSelectedImage(productData.images ? productData.images[0] : "");
    }
  }, [productData]);

  // Update isWishlisted state when product or wishlist changes
  useEffect(() => {
    if (productData) {
      setIsWishlisted(wishlistItems.some((item) => item.id === productData.id));
    }
  }, [productData, wishlistItems]);

  if (!productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    const existingItem = cartItems.find(
      (item) => item.id === productData.id && item.size === selectedSize
    );

    if (existingItem) {
      toast.error("Item already in the cart!");
      return;
    }
    dispatch(addToCart({ product: productData, size: selectedSize, quantity }));
    toast.success("Item added to cart successfully!");
  };

  const handleWishlistToggle = () => {
    if (wishlistItems.some((item) => item.id === productData.id)) {
      dispatch(removeFromWishlist(productData.id));
      setIsWishlisted(false);
    } else {
      dispatch(addToWishlist(productData));
      setIsWishlisted(true);
    }
  };

  const handleBuyNow = async () => {
    const amount = productData.price * quantity;
    const response = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: productData,
        selectedSize: selectedSize,
        quantity: quantity,
        amount: amount,
      }),
    });

    const data = await response.json();
    if (data.success) {
      initiateRazorpayCheckout(data.order);
    } else {
      console.error("Error creating Razorpay order:", data.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className=" w-full aspect-square overflow-hidden rounded-lg bg-gray-200">
              <img
                src={productData.image}
                alt={productData.name}
                width={600}
                height={600}
                className="w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productData.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-md ${
                    selectedImage === image
                      ? "ring-2 ring-blue-600"
                      : "ring-1 ring-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productData.title} ${index + 1}`}
                    width={100}
                    height={100}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productData.name}
              </h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(productData.rating || 4)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({productData.reviews || 0} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{productData.price}
              </span>
            </div>

            {/* Description */}
            {/* <p className="text-gray-600">{productData.description}</p> */}

            {/* Size Selection */}
            <div>
              <div className="flex items-center text-gray-600 space-x-2">
                <FaRulerHorizontal size={20} />
                <span className="font-medium">Size Guide</span>
              </div>
              <p className="text-sm mt-5 font-medium text-gray-900 mb-2">
                SIZE : <span>{productData.size}</span>
              </p>
              {/* <div className="flex flex-wrap gap-2">
                {productData?.size?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <FiShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-3 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <FiHeart
                  className={`w-5 h-5 ${
                    isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
            >
              Buy Now
            </button>

            {/* Product Features */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4 text-gray-600">
                Product Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <FiTruck className="w-4 h-4 mr-2 text-green-600" />
                  Free shipping on orders over ₹1000
                </li>
                <li className="flex items-center">
                  <FiStar className="w-4 h-4 mr-2 text-yellow-600" />
                  {productData.rating} star rating
                </li>
                <li className="flex items-center">
                  <FiShoppingCart className="w-4 h-4 mr-2 text-blue-600" />
                  Easy returns
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
