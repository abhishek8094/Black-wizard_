"use client"
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";

const OrderTracker = () => {
  const [searchBy, setSearchBy] = useState("order_id");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrackOrder = () => {
    if (!orderNumber.trim()) {
      setError("Please enter an order number.");
      return;
    }
    setLoading(true);
    setError("");
    setOrderStatus(null);

    // Mock API call - replace with real API
    setTimeout(() => {
      // Updated mock data with time and status steps matching Flipkart style
      const mockData = {
        orderId: orderNumber,
        status: "Out For Delivery",
        trackingNumber: "TRK" + orderNumber,
        estimatedDelivery: "2023-12-15 18:00",
        currentLocation: "Out For Delivery - New York, NY",
        history: [
          { date: "2023-12-01 10:00", status: "Order Confirmed" },
          { date: "2023-12-02 14:00", status: "Order Packed" },
          { date: "2023-12-05 09:00", status: "Package Shipped" },
          { date: "2023-12-14 08:00", status: "Out For Delivery" },
          { date: null, status: "Order Delivered" }
        ]
      };
      setOrderStatus(mockData);
      setLoading(false);
    }, 1000); // Simulate delay
  };

  return (
    <>
     <div className="tracking-header text-center mb-6 mt-6">
      <div className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-800">
        <FaTruck /> Track Your Order
      </div>
      <p className="text-gray-600 mt-2 max-w-xl mx-auto ">
        Enter your tracking number or order ID to get real-time updates on your shipment.
      </p>
    </div>
    <div className="w-full max-w-2xl mx-auto py-12">
      <div className="search text-start shadow-lg p-6 max-w-full rounded-md bg-white">
        {/* Search By */}
        <div className="inputGroup inline-radio mb-4">
          <label className="font-medium text-lg">Search By:</label>
        </div>

        {/* Radio Option */}
        <div className="inputGroup inline-radio mb-4 flex items-center">
          <input
            id="order_id"
            type="radio"
            checked={searchBy === "order_id"}
            onChange={() => setSearchBy("order_id")}
            name="search-checkbox"
            className="cursor-pointer"
          />
          <label
            htmlFor="order_id"
            className="ml-2 mr-4 roboto-font text-base cursor-pointer"
          >
            Order No
          </label>
        </div>

        {/* Input & Button */}
        <div className="input-group">
          <input
            className="w-full px-4 py-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Enter Your Order No"
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
          <button
            type="button"
            onClick={handleTrackOrder}
            className="w-full flex items-center justify-center gap-2 px-6 py-2 bg-black text-white cursor-pointer rounded hover:bg-gray-900 transition"
          >
            <FaSearch /> Track Your Order
          </button>
        </div>
      </div>

      {/* Order Status Display */}
      {loading && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">Tracking your order...</p>
        </div>
      )}
      {error && (
        <div className="mt-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      {orderStatus && (
        <div className="mt-6 shadow-lg p-6 max-w-full rounded-md bg-white">
          <h3 className="text-lg font-bold mb-4">Order Status</h3>
          <div className="mb-4">
            <strong>Order ID:</strong> {orderStatus.orderId} 
          </div>
          <div className="mb-4">
            <strong>Estimated Delivery:</strong> {orderStatus.estimatedDelivery}
          </div>
       

          {/* Order Timeline */}
          <div className="order-timeline">
          {orderStatus.history.map((step, index) => {
            const isCompleted = index < orderStatus.history.findIndex(s => s.status === orderStatus.status) || orderStatus.status === step.status;
            const isLast = index === orderStatus.history.length - 1;
            return (
              <div key={index} className="flex items-center mb-4">
                <div className={`flex flex-col items-center mr-4`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {isCompleted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className={`w-3 h-3 rounded-full ${isLast ? 'bg-gray-400' : 'bg-gray-300'}`}></div>
                    )}
                  </div>
                  {!isLast && <div className={`w-1 h-12 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}></div>}
                </div>
                <div>
                  <p className={`font-medium ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>{step.status}</p>
                  <p className="text-sm text-gray-600">{step.date || 'Pending'}</p>
                </div>
              </div>
            );
          })}
          </div>

        </div>
      )}
    </div>
    </>
  );
};

export default OrderTracker;
