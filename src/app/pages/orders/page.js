"use client"
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; 

const Orders = () => {
  // Dummy orders data
  const orders = [
    {
      id: 'ORD-001',
      date: '2023-10-01',
      items: ['Compression T-Shirt', 'Joggers'],
      total: 150.00,
      status: 'Delivered'
    },
    {
      id: 'ORD-002',
      date: '2023-09-25',
      items: ['Jacket', 'Stringers'],
      total: 200.00,
      status: 'Shipped'
    },
    {
      id: 'ORD-003',
      date: '2023-09-20',
      items: ['Vest', 'T-Shirt'],
      total: 120.00,
      status: 'Processing'
    }
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8  text-gray-800">
      <section aria-label="Orders" className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart className="text-blue-600" />
            Orders
          </h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="mb-4">Go to store to place an order.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                  <span className={`px-2 py-1 rounded text-sm ${
                    order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">Date: {order.date}</p>
                <p className="text-gray-600 mb-2">Items: {order.items.join(', ')}</p>
                <p className="text-gray-800 font-semibold">Total: ${order.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
