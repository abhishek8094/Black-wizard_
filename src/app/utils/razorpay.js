export const initiateRazorpayCheckout = (data) => {
  const options = {
    key: data.key, 
    amount: data.order.amount, 
    currency: data.order.currency,
    name: "Black-Wizard",
    description: "Purchase Description",
    order_id: data.order.id, 
    handler: function (response) {
      // Handle successful payment here
      // You can also send the response to your server for verification
    },
    prefill: {
      name: "Customer Name",
      email: "customer@example.com",
      contact: "9999999999",
    },
    theme: {
      color: "#F37254",
    },
  };

  console.log(options)

  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
