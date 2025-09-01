"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { initiateRazorpayCheckout } from "@/app/utils/razorpay";

export default function CheckoutPage() {
  const { items, getTotalPrice } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleCheckout = async () => {
      if (items.length === 0) {
        router.push("/cart");
        return;
      }

      const totalAmount = getTotalPrice();
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
  }, [items, getTotalPrice, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl text-gray-600">Redirecting to payment...</p>
    </div>
  );
}
