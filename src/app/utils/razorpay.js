"use client";

export const initiateRazorpayCheckout = (data) => {

  const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");

  const firstName = userProfile.firstName || "";
  const lastName = userProfile.lastName || "";
  const email = userProfile.email || "customer@example.com";

  const options = {
    key: data.key,
    amount: data.order.amount,
    currency: data.order.currency,
    name: "Black-Wizard",
    description: "Purchase Description",
    order_id: data.order.id,
    handler: function (response) {
      window.location.href = `/pages/payment/success?payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`;
    },
    prefill: {
      name: `${firstName} ${lastName}`,
      email: email,
    },
    theme: {
      color: "#F37254",
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
