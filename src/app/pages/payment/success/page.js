"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiShoppingBag, FiHome, FiMail } from 'react-icons/fi';

// Component that uses useSearchParams - wrapped in Suspense
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (paymentId && orderId) {
      fetchOrderDetails();
    } else {
      setError('Missing payment information');
      setLoading(false);
    }
  }, [paymentId, orderId]);

  const fetchOrderDetails = async () => {
    try {
      // In a real application, you would fetch order details from your backend
      // For now, we'll simulate the data
      setTimeout(() => {
        setOrderDetails({
          paymentId,
          orderId,
          amount: 2499, // Example amount in rupees
          items: [
            { name: 'Premium T-Shirt', quantity: 2, price: 999 },
            { name: 'Designer Jeans', quantity: 1, price: 1500 }
          ],
          shippingAddress: {
            name: 'John Doe',
            street: '123 Main Street',
            city: 'Mumbai',
            state: 'Maharashtra',
            zip: '400001',
            phone: '+91 9876543210'
          },
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        });
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Failed to load order details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your order. Your payment has been confirmed.
          </p>
          <p className="text-sm text-gray-500">
            Order ID: {orderDetails.orderId} | Payment ID: {orderDetails.paymentId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiShoppingBag className="mr-2" />
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-6">
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{orderDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total</span>
                <span>₹{orderDetails.amount}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FiMail className="mr-2" />
              Shipping Details
            </h2>
            
            <div className="space-y-2">
              <p><strong>Name:</strong> {orderDetails.shippingAddress.name}</p>
              <p><strong>Address:</strong> {orderDetails.shippingAddress.street}</p>
              <p><strong>City:</strong> {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
              <p><strong>ZIP:</strong> {orderDetails.shippingAddress.zip}</p>
              <p><strong>Phone:</strong> {orderDetails.shippingAddress.phone}</p>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Estimated Delivery:</strong>{' '}
                {orderDetails.estimatedDelivery.toLocaleDateString()}
              </p>
              <p className="text-xs text-blue-600 mt-1">
                You will receive a confirmation email with tracking information shortly.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <FiHome className="mr-2" />
              Continue Shopping
            </Link>
            <Link
              href="/pages/orders"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md hover:bg-gray-50 flex items-center justify-center"
            >
              <FiShoppingBag className="mr-2" />
              View Orders
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            Need help? Contact our support team at support@fashionstore.com
          </p>
        </div>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
