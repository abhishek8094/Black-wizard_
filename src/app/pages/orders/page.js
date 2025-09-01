"use client"
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; 

const Orders = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8  text-gray-800">
      <section aria-label="Orders" className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart className="text-blue-600" />
            Orders
          </h1>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="mb-4">Go to store to place an order.</p>
          
        </div>
      </section>
    </div>
  );
};

export default Orders;
