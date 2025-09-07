"use client";
import React from "react";
import { FaLock } from "react-icons/fa";

export default function Settings() {
  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl text-gray-700 font-semibold mb-6">Settings</h2>
      <div className="flex">
        <div className="flex items-center  p-6 rounded-lg ">
          <FaLock className="text-gray-700 text-xl mr-3" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-700">
              Sign out everywhere
            </h3>
            <p className="text-gray-600 text-sm">
              If you've lost a device or have security concerns, log out
              everywhere to ensure the security of your account.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 h-20 mt-5 px-8 shadow-lg rounded-lg bg-white border w-full">
          <button className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 text-blue-600 font-medium">
            Sign out everywhere
          </button>
          <span className="text-gray-500 text-sm">
            You'll also be signed out on this device.
          </span>
        </div>
      </div>
    </div>
  );
}
