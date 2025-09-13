"use client";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
import { addOrder } from "../../redux/slices/orderSlice";

export default function CartPage() {
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectTotalPrice);
  const {addressesData} = useSelector((state) => state.address);
  const dispatch = useDispatch();
  const router = useRouter();
  const token = getToken();
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  const handleCheckout = async () => {
    if (token) {
      // Prepare order data using the provided JSON structure
      const products = items.map(item => ({
        product: item._id,
        quantity: item.quantity
      }));

      const defaultAddress = addressesData.data[0]._id
      const shippingAddress = defaultAddress;
      const orderData = {
        products,
        shippingAddress,
        paymentMethod
      };

      // Dispatch addOrder to create the order
      try {
        const resultAction = await dispatch(addOrder(orderData));
        if (addOrder.fulfilled.match(resultAction)) {
          // Order created successfully, proceed to payment
          const orderId = resultAction.payload.id; // Assuming the response has order ID

          // Store cart items in localStorage before checkout
          localStorage.setItem("checkoutItems", JSON.stringify(items));
          const subtotal = totalPrice;
          const shipping = 0; // Free shipping
          const total = subtotal + shipping;
          const orderSummary = { subtotal, shipping, total };
          localStorage.setItem("orderSummary", JSON.stringify(orderSummary));

          const response = await fetch("/api/razorpay", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product: items,
              amount: total,
              orderId, 
            }),
          });

          const data = await response.json();
          if (data.success) {
            initiateRazorpayCheckout(data);
          } else {
            console.error("Error creating Razorpay order:", data.error);
          }
        } else {
          console.error("Failed to create order:", resultAction.payload);
        }
      } catch (error) {
        console.error("Error during checkout:", error);
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

  if (items.length === 0) {
    return (
      <div className="p-28 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingCart className="mx-auto mb-4 w-16 h-16 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4 whitespace-nowrap">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8 whitespace-nowrap">
            Add some products to get started!
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold  text-gray-900 mb-8">
          Shopping Cart
        </h1>

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
                    <p className="text-lg font-bold text-gray-900">
                      ₹{item.price}
                    </p>
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
                      dispatch(
                        removeFromCart({ id: item.id, size: item.size })
                      );
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
