"use client"
import React, { useEffect } from 'react';
import { FaShoppingCart } from 'react-icons/fa'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from '@/app/redux/slices/orderSlice';

const Orders = () => {

  const dispatch = useDispatch();
  const { orders} = useSelector((state) => state.orders);

  useEffect(()=>{
    dispatch(fetchOrders())
  },[])

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8  text-gray-800">
      <section aria-label="Orders" className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaShoppingCart className="text-blue-600" />
            Orders
          </h1>
        </div>

        {orders?.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="mb-4">Go to store to place an order.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders?.data?.map((order,idx) => (
              <div key={idx} className="border rounded-lg p-4 bg-gray-50">
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
                <p className="text-gray-600 mb-2">Date: {new Date(order.createdAt).toISOString().split('T')[0]}</p>
                <p className="text-gray-600 mb-2">Items: {order?.items?.join(', ')}</p>
                <p className="text-gray-800 font-semibold">Total: Rs. {order.totalAmount?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;
