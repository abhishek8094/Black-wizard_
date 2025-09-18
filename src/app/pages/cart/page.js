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
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleCheckout = async () => {
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    if (token) {
      // Check if user has any addresses
      if (!addressesData?.data || addressesData.data.length === 0) {
        toast.error("Please add a shipping address before proceeding to checkout");
        router.push("/account/user-profile");
        return;
      }

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
        console.log(resultAction,"hello")
        if (addOrder.fulfilled.match(resultAction)) {
          // Order created successfully
          const orderId = resultAction.payload.id; // Assuming the response has order ID

          if (paymentMethod === "cod") {
            // For Cash on Delivery, redirect to success page or show success message
            toast.success("Order placed successfully! You will pay when the order is delivered.");
            // Clear cart after successful order
            items.forEach(item => {
              dispatch(removeFromCart({ id: item._id, size: item.size }));
            });
            router.push("/"); // Redirect to home page
          } else {
            // For Razorpay, proceed with payment gateway
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
            console.log("data",data);
            if (data.success) {
              initiateRazorpayCheckout(data);
            } else {
              console.error("Error creating Razorpay order:", data.error);
            }
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
      <div className="p-8 sm:p-16 lg:p-28 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <FiShoppingCart className="mx-auto mb-6 w-20 h-20 sm:w-24 sm:h-24 text-gray-400" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Add some products to get started!
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-shadow"
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

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Cart Items */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white space-y-3 ">
              {items.map((item) => (
                <div
                  key={`${item._id}-${item.size}`}
                  className="flex flex-col p-4 sm:p-6 border-b last:border-b-0 rounded-lg shadow-lg border border-gray-400"
                >
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 w-20 h-24 sm:w-24 sm:h-36">
                      <img
                        src={item.image}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 ml-4 text-left">
                      <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-600">Size: {item.size}</p>
                      <p className="text-lg font-bold text-gray-900 mt-1">
                        ₹{item.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <button
                        onClick={() =>
                          dispatch(
                            updateQuantity({
                              id: item._id,
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
                              id: item._id,
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
                          removeFromCart({ id: item._id, size: item.size })
                        );
                        toast.success("Item removed from the cart");
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3 text-gray-800 rounded-lg shadow-lg p-6 border border-gray-400">
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

            {/* Payment Method Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    <span className="font-medium">Razorpay</span>
                    <span className="ml-2 text-sm text-gray-500">(Cards, UPI, Net Banking)</span>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    <span className="font-medium">Cash on Delivery</span>
                    <span className="ml-2 text-sm text-gray-500">(Pay when delivered)</span>
                  </div>
                </label>
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