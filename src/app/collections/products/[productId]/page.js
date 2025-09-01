
'use client';
import React, { useState, useEffect } from 'react';
import { allProducts } from '@/app/constant/constant';
import { FiHeart, FiShoppingCart, FiStar, FiTruck } from 'react-icons/fi';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWishlist } from '@/app/context/WishlistContext';
import { generateProductSlug } from '@/app/utils/slugify';
import { initiateRazorpayCheckout } from '@/app/utils/razorpay';

export default function ProductDetailPage({ params }) {
  const unwrappedParams = React.use(params);
  const { productId: slug } = unwrappedParams;
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const foundProduct = allProducts.find(p => generateProductSlug(p.title) === slug);
    if (foundProduct) {
      // Ensure all required properties have fallback values
      const productWithDefaults = {
        ...foundProduct,
        images: foundProduct.images || [foundProduct.image],
        size: foundProduct.size || ['S', 'M', 'L', 'XL'],
        rating: foundProduct.rating || 4.0,
        reviews: foundProduct.reviews || 0,
        originalPrice: foundProduct.originalPrice || foundProduct.price,
        inStock: foundProduct.inStock !== undefined ? foundProduct.inStock : true
      };
      setProduct(productWithDefaults);
      setSelectedSize(productWithDefaults.size[0]);
      setSelectedImage(productWithDefaults.image);
    }
  }, [slug]);

  // Update isWishlisted state when product or wishlist changes
  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    );
  }

  const { addToCart, items } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  
  const handleAddToCart = () => {
    const existingItem = items.find(item => 
      item.id === product.id && item.size === selectedSize
    );

    if (existingItem) {
      toast.error("Item already in the cart!");
      return;
    }
    addToCart(product, selectedSize, quantity);
    toast.success("Item added to cart successfully!");
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const handleBuyNow = async () => {
    const amount = product.price * quantity;
    const response = await fetch("/api/razorpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: product,
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

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className=" w-full aspect-square overflow-hidden rounded-lg bg-gray-200">
              <Image
                src={selectedImage || product.image}
                alt={product.title}
                width={600}
                height={600}
                className="w-full object-cover object-center"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images?.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-w-1 aspect-h-1 overflow-hidden rounded-md ${
                    selectedImage === image ? 'ring-2 ring-blue-600' : 'ring-1 ring-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(product.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews || 0} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600">{product.description}</p>

            {/* Size Selection */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.size.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            {/* <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div> */}

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
                <FiHeart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
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
              <h3 className="text-lg font-medium mb-4">Product Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <FiTruck className="w-4 h-4 mr-2 text-green-600" />
                  Free shipping on orders over ₹1000
                </li>
                <li className="flex items-center">
                  <FiStar className="w-4 h-4 mr-2 text-yellow-600" />
                  {product.rating} star rating
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
