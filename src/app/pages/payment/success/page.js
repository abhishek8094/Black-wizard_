"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { getFormattedDefaultAddress } from '@/app/utils/addressUtils';


function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');

  const { addressesData } = useSelector((state) => state.address);
  const defaultAddress = getFormattedDefaultAddress(addressesData);
  console.log(defaultAddress)

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
      setTimeout(() => {
        setOrderDetails({
          paymentId,
          orderId,
          subtotal: 500,
          productDiscount: 50,
          couponDiscount: 45,
          shipping: 0,
          total: 405,
          mobile: "8765464243",
          shippingAddress: defaultAddress,
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          items: [
            {
              name: "Compression T-Shirt",
              quantity: 1,
              price: 405,
              originalPrice: 500,
              discountPercent: 19,
              imageUrl: "/public/products/compression/compression-tshirt1.jpeg"
            }
          ]
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
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FiCheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>

        {/* Thank you message */}
        <h2 className="text-center font-semibold text-lg mb-1">Thank you for your purchase!</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          We've received your order.
        </p>

        {/* Shipping info */}
        <p className="text-center text-xs text-gray-700 mb-6">
          It will ship to: <br />
          <span className="font-semibold">
            {orderDetails.shippingAddress?.name || 'No address available'}, {orderDetails.shippingAddress?.street || ''}, {orderDetails.shippingAddress?.city || ''} - {orderDetails.shippingAddress?.zip || ''}
          </span>
        </p>

        <p className="text-center text-xs text-gray-700 mb-6">
          Expected delivery date: <span className="font-semibold">{orderDetails.estimatedDelivery.toLocaleDateString()}</span><br />
          Order No: <span className="font-semibold">{orderDetails.orderId}</span><br />
          Payment ID: <span className="font-semibold">{orderDetails.paymentId}</span><br />
          Mobile No: <span className="font-semibold">{orderDetails.mobile}</span>
        </p>

        {/* Order Summary */}
        <div className="border border-gray-300 rounded-md p-4 mb-6">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          {orderDetails.items.map((item, index) => (
            <div key={index} className="flex items-center border border-gray-300 rounded-md p-2 mb-3">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-md mr-4" />
              <div className="flex-grow">
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="text-green-600 font-semibold">₹{item.price}</p>
                <p className="text-xs line-through text-gray-400">₹{item.originalPrice}</p>
                <span className="text-xs bg-green-100 text-green-600 rounded px-1 ml-1">{item.discountPercent}% off</span>
              </div>
            </div>
          ))}

          <div className="border-t border-gray-300 pt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Product discount</span>
              <span>₹{orderDetails.productDiscount}</span>
            </div>
            <div className="flex justify-between">
              <span>Coupon discount</span>
              <span>₹{orderDetails.couponDiscount}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{orderDetails.shipping}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>₹{orderDetails.total}</span>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <Link
          href="/"
          className="block bg-black text-white text-center py-3 rounded-md hover:bg-gray-900"
        >
          Continue Shopping
        </Link>
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
