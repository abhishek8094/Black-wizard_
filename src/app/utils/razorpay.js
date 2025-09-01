export const initiateRazorpayCheckout = (data) => {

  console.log(data)
  const options = {
    key: data.key, // Razorpay key
    amount: data.order.amount, // Amount is in currency subunits
    currency: data.order.currency,
    name: "Your Company Name",
    description: "Purchase Description",
    order_id: data.order.id, // This is the order_id created in the backend
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
