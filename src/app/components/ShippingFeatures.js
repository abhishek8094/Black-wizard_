"use client";
import React from "react";
import { FaHeadset } from "react-icons/fa"; 
import { RiSecurePaymentFill } from "react-icons/ri";

const features = [
  {
    title: "Shipping All India",
    description: "Enjoy free shipping across on all orders above ₹1000!",
    icon: (
      <svg viewBox="0 0 508 508" className="w-12 h-12 text-gray-800">
        <path d="M430.4,0H77.6L0,112.1V508h508V112.1L430.4,0z M335.9,16.4h85.8l62.5,90.1H335.9V16.4z M188.5,16.4h131.1v90.1H188.5V16.4z M188.4,122.9h131.1v74.8l-16.4-10.9l-24.6,16.4L254,186.8l-24.6,16.4l-24.6-16.4l-16.4,10.9V122.9z M86.2,16.4H172v90.1H23.8L86.2,16.4z M491.8,491.6H16.4V122.9h155.7v105.4l32.8-21.9l24.6,16.4l24.6-16.4l24.6,16.4l24.6-16.4l32.8,21.9V122.9h155.7V491.6z" />
      </svg>
    ),
  },
  {
    title: "Premium Quality",
    description:
      "Crafted for Performance. Designed for You. Premium Quality in Every Stitch.",
    icon: (
      <svg viewBox="0 0 28 32" className="w-12 h-12 text-gray-800">
        <path d="M27.467 10.667l-6.293-7.467h-14.4l-6.293 7.467-.48.533.427.533 13.547 17.067 13.973-17.6-.48-.533zm-1.387 0H15.36l5.333-6.347 5.387 6.347zm-12.16 0l-5.547-6.4h10.987l-5.44 6.4zM7.147 4.427l5.387 6.24H1.867l5.28-6.24zm6.293 7.306v14.667L1.76 11.733h11.68zm1.067 14.667V11.733h11.627L14.507 26.4z" />
      </svg>
    ),
  },
  {
    title: "Security Payment",
    description: "We ensure secure payment with PEV",
    icon: <RiSecurePaymentFill className="w-12 h-12 text-gray-800" />
  },
  {
    title: "Customer Support",
    description: "Contact us 10:00 am – 6:00 pm ( Mon-Sat)",
    icon:  <FaHeadset className="w-12 h-12 text-gray-800" />
  },
];

export default function ShippingFeatures() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 text-center shadow hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4 text-gray-800">
              {feature.icon}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
