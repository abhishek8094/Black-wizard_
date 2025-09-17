"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchAddresses,
  updateAddress,
  deleteAddress,
} from "@/app/redux/slices/addressSlice";
import AddressModal from "@/app/components/AddressModal";
import { toast } from "react-toastify";

export default function AdminAddresses() {
  const { userData } = useSelector((state) => state.auth);
  const {
    addressesData,
    loading,
    error,
  } = useSelector((state) => state.address);

  const dispatch = useDispatch();
  const router = useRouter();

  const getUserRole = () => {
    if (userData?.user?.role) {
      return userData.user.role;
    }
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole");
    }
    return null;
  };

  const userRole = getUserRole();

  useEffect(() => {
    if (userRole !== "admin") {
      router.push("/home/login");
    }
  }, [userRole, router]);

  useEffect(() => {
    if (userRole === "admin") {
      dispatch(fetchAddresses());
    }
  }, [userRole, dispatch]);

  // Check if user is admin
  if (userRole !== "admin") {
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      const result = await dispatch(deleteAddress(id)).unwrap();
      if (result?.success === true) {
        toast.success(result.message || "Address deleted successfully");
      }
      await dispatch(fetchAddresses());
    }
  };

  return (
    <div className="pt-2 pb-6 px-2 sm:px-6 bg-gray-100 text-gray-700 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-nowrap">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-700">Manage Addresses</h1>
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            Add Address
          </button>
        </div>
        <div className="max-w-6xl mx-auto">
          <AddressModal
            isOpen={isModalOpen}
            onClose={closeModal}
            address={editingAddress}
          />

          {loading ? (
            <p>Loading addresses...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : !addressesData || !addressesData.data || addressesData.data.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No addresses found.</p>
          ) : (
            <>
              <div className="bg-white text-gray-700 rounded shadow overflow-hidden hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 sm:p-4 text-left">Name</th>
                        <th className="p-2 sm:p-4 text-left">Address</th>
                        <th className="p-2 sm:p-4 text-left">City</th>
                        <th className="p-2 sm:p-4 text-left">State</th>
                        <th className="p-2 sm:p-4 text-left">PIN</th>
                        <th className="p-2 sm:p-4 text-left">Phone</th>
                        <th className="p-2 sm:p-4 text-left">Default</th>
                        <th className="p-2 sm:p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addressesData.data.map((address, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="p-2 sm:p-4">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">
                                {address.firstName} {address.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="p-2 sm:p-4 text-gray-600">
                            {address.address}
                            {address.apartmentSuite && `, ${address.apartmentSuite}`}
                          </td>
                          <td className="p-2 sm:p-4 text-gray-600">{address.city}</td>
                          <td className="p-2 sm:p-4 text-gray-600">{address.state}</td>
                          <td className="p-2 sm:p-4 text-gray-600">{address.pinCode}</td>
                          <td className="p-2 sm:p-4 text-gray-600">{address.phone}</td>
                          <td className="p-2 sm:p-4 text-gray-600">
                            {address.defaultAddress ? "Yes" : "No"}
                          </td>
                          <td className="p-2 sm:p-4 whitespace-nowrap">
                            <button
                              onClick={() => openEditModal(address)}
                              className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded mr-2 inline-block"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(address._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 sm:px-3 sm:py-1 rounded inline-block"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="block sm:hidden">
                {addressesData.data.map((address, idx) => (
                  <div key={idx} className="bg-white rounded shadow p-4 mb-4">
                    <div className="mb-2">
                      <h3 className="font-bold text-gray-700">
                        {address.firstName} {address.lastName}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {address.address}
                        {address.apartmentSuite && `, ${address.apartmentSuite}`}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {address.city}, {address.state} - {address.pinCode}
                      </p>
                      <p className="text-gray-600 text-sm">{address.phone}</p>
                      <p className="text-gray-600 text-sm">
                        Default: {address.defaultAddress ? "Yes" : "No"}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(address)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(address._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded flex-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
