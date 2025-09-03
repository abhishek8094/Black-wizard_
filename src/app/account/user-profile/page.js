"use client"
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FiPlus, FiInfo } from "react-icons/fi";
import EditProfileModal from "@/app/components/EditProfileModal";
import AddressModal from "@/app/components/AddressModal";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const addresses = [];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const userEmail = useSelector((state) => state.auth.userData?.email || "");
  const userName = useSelector((state) => state.auth.userData?.name || "No name added");


  return (
    <main className="max-w-5xl mx-auto p-6 space-y-8 py-20 ">
      {/* Profile Section */}
      <div className="max-w-full mx-auto p-6 bg-white shadow-md rounded-md">
        {/* Header with Name and Edit Button */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="block text-gray-500 text-sm">Name</span>
            <span className="text-lg font-semibold text-gray-800">
              {userName}
            </span>
          </div>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 transition"
            aria-label="Edit profile"
            onClick={() => setIsModalOpen(true)}
          >
            <FaEdit size={20} />
          </button>
        </div>

        {/* Email Section */}
        <div>
          <span className="block text-gray-500 text-sm">Email</span>
          <span className="text-base text-gray-800">
            {userEmail || "No email available"}
          </span>
        </div>
      </div>

      {/* Address Section */}
      <section className="p-6 bg-white rounded-lg shadow-md max-w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Addresses</h2>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            aria-label="Add address"
            onClick={() => setIsAddressModalOpen(true)}
          >
            <FiPlus className="text-lg" />
            <span className="font-medium">Add</span>
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500">
            <FiInfo className="text-xl" />
            <span>No addresses added</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {addresses.map((address, index) => (
              <li key={index} className="p-4 border rounded-md">
                {/* Render address details here */}
                {address}
              </li>
            ))}
          </ul>
        )}
      </section>
      <EditProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={userEmail} />
      <AddressModal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} />
    </main>
  );
};

export default UserProfile;
