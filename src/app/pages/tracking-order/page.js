"use client"
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaTruck } from "react-icons/fa";

const OrderTracker = () => {
  const [searchBy, setSearchBy] = useState("order_id");
  const [orderNumber, setOrderNumber] = useState("");

  const handleTrackOrder = () => {
    console.log("Searching for:", orderNumber);
    // Add your API call or logic here
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
    </div>
    </>
  );
};

export default OrderTracker;
