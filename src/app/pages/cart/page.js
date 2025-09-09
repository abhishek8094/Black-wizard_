"use client";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { initiateRazorpayCheckout } from "@/app/utils/razorpay";
import {
  selectCartItems,
  selectTotalPrice,
  addToCart,
  removeFromCart,
  updateQuantity,
} from "../../redux/slices/cartSlice";
import { getToken } from "@/app/api/auth";
import { fetchAddresses } from "../../redux/slices/addressSlice";
import { getFormattedDefaultAddress } from "@/app/utils/addressUtils";

export default function CartPage() {
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = getToken();

  const handleCheckout = async () => { 
    if (token) {
      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: items,
          amount: totalPrice,
        }),
      });

      const data = await response.json();
     // console.log("data", data);
      if (data.success) {
        initiateRazorpayCheckout(data);
      } else {
        console.error("Error creating Razorpay order:", data.error);
      }
    } else {
      router.push("/home/login");
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(fetchAddresses());
    }
  }, [dispatch, token]);

  const { addressesData } = useSelector((state) => state.address);
  const defaultAddress = getFormattedDefaultAddress(addressesData);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold  text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg border border-gray-400">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex items-center p-6 border-b last:border-b-0"
                >
                  <div className="bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="w-full h-36 object-cover"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Size: {item.size}</p>
                    <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            size: item.size,
                            quantity: Math.max(1, item.quantity - 1),
                          })
                        )
                      }
                      className="p-1 border border-gray-600 rounded hover:bg-gray-50"
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            size: item.size,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                      className="p-1 border border-gray-600 rounded hover:bg-gray-50"
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      dispatch(removeFromCart({ id: item.id, size: item.size }));
                      toast.success("Item removed from the cart");
                    }}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className=" text-gray-800 rounded-lg shadow-lg p-6 border border-gray-400">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
