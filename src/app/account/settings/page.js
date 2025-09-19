"use client";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { doLogout } from "../../api/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Settings() {
  const route = useRouter();
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    const result = await dispatch(logout()).unwrap();
    if (result.success === true) {
      toast.success(result.message);
      doLogout();
      route.push("/");
    }
  };
  return (
    <div className="p-4 sm:p-8 md:p-16">
      <h2 className="text-xl sm:text-2xl text-gray-700 font-semibold mb-6">Settings</h2>
      <div className="flex flex-col md:flex-row md:space-x-6">
      <div className="flex items-center p-4 sm:p-6 rounded-lg mb-4 md:mb-0">
          <FaLock className="text-gray-700 text-xl mr-3" />
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-700">
              Sign out everywhere
            </div>
            <p className="text-gray-600 text-sm">
              If you've lost a device or have security concerns, log out
              everywhere to ensure the security of your account.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 h-20 px-4 sm:px-8 shadow-lg rounded-lg bg-white border w-full">
          <button
            onClick={handleLogOut}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 text-blue-600 font-medium"
          >
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
