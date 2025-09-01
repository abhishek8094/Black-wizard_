"use client"
import React from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog } from 'react-icons/fa';
import Link from 'next/link';

const UserMenu = () => {
  return (
    <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-4">
      <ul className="space-y-3">
        {/* Email Row */}
        <li className="flex items-center space-x-3">
          <FaUserCircle className="text-gray-500 text-xl" />
          <span className="text-sm text-gray-800 break-words">abhisheksingh49982@gmail.com</span>
        </li>

        {/* Divider */}
        <hr className="border-gray-200" />

        {/* Profile Link */}
        <li>
          <Link
            to="/69406031919/account/profile"
            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition"
          >
            <FaUserCircle />
            <span>Profile</span>
          </Link>
        </li>

        {/* Settings Link */}
        <li>
          <Link
            to="/69406031919/account/settings"
            className="flex items-center space-x-2 text-sm text-gray-700 hover:text-blue-600 transition"
          >
            <FaCog />
            <span>Settings</span>
          </Link>
        </li>

        {/* Logout Button */}
        <li>
          <button
            type="button"
            className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-800 transition"
            onClick={() => {
              // Add your logout logic here
              console.log("Logged out");
            }}
          >
            <FaSignOutAlt />
            <span>Log out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserMenu;
