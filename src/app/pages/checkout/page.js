"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { selectCartItems, selectTotalPrice } from "@/app/redux/slices/cartSlice";
import { initiateRazorpayCheckout } from "@/app/utils/razorpay";

export default function CheckoutPage() {
  const items = useSelector(selectCartItems);
  const totalAmount = useSelector(selectTotalPrice);
  const router = useRouter();

  useEffect(() => {
    const handleCheckout = async () => {
      if (items.length === 0) {
        router.push("/cart");
        return;
      }

      const response = await fetch("/api/razorpay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: items,
          amount: totalAmount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        initiateRazorpayCheckout(data.order);
      } else {
        console.error("Error creating Razorpay order:", data.error);
      }
    };

    handleCheckout();
  }, [items, totalAmount, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600">Redirecting to payment...</p>
    </div>
  );
}
