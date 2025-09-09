"use client";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { FiPlus, FiInfo } from "react-icons/fi";
import EditProfileModal from "@/app/components/EditProfileModal";
import AddressModal from "@/app/components/AddressModal";
import { useSelector, useDispatch } from "react-redux";
import { fetchAddresses } from "@/app/redux/slices/addressSlice";

const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const dispatch = useDispatch();
  const userDataFromRedux = useSelector((state) => state.auth.userData?.user);
  const userDataFromStorage =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userProfile") || "{}")
      : {};
  const userEmail = userDataFromStorage.email || userDataFromRedux?.email || "";
  const userName =
    `${userDataFromStorage.firstName || ""} ${
      userDataFromStorage.lastName || ""
    }`.trim() ||
    userDataFromRedux?.name ||
    "No name added";
  const { addressesData, loading } = useSelector((state) => state.address);

  useEffect(() => {
    dispatch(fetchAddresses());
  }, [dispatch]);

  return (
    <main className="max-w-5xl mx-auto pb-6 px-6 space-y-4  text-gray-800 ">
     <h2 className="text-2xl text-gray-700 mt-6 font-semibold mb-6">Profile</h2>
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
            onClick={() => {
              setSelectedAddress(null);
              setIsAddressModalOpen(true);
            }}
          >
            <FiPlus className="text-lg" />
            <span className="font-medium">Add</span>
          </button>
        </div>

        {loading ? (
          <div className="text-gray-500">Loading addresses...</div>
        ) : addressesData?.data?.length === 0 ? (
          <div className="flex items-center gap-2 text-gray-500">
            <FiInfo className="text-xl" />
            <span>No addresses added</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {addressesData?.data?.map((address, index) => (
              <li key={index} className="p-4 border rounded-md space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    {address.defaultAddress && (
                      <span className="text-green-600 text-sm font-medium bg-green-100  py-0.5 rounded">
                        Default Address
                      </span>
                    )}
                    <div>
                      <strong>
                        {address.firstName} {address.lastName}
                      </strong>
                    </div>
                    <div>
                      {address.address}, {address.apartmentSuite || ""}
                    </div>
                    <div>
                      {address.city}, {address.state} - {address.pinCode}
                    </div>
                    <div>{address.countryRegion}</div>
                    <div>Phone: {address.phone}</div>
                  </div>
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 transition"
                    aria-label="Edit address"
                    onClick={() => {
                      setSelectedAddress(address);
                      setIsAddressModalOpen(true);
                    }}
                  >
                    <FaEdit size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={userEmail}
        name={userName}
      />
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setSelectedAddress(null);
        }}
        address={selectedAddress}
      />
    </main>
  );
};

export default UserProfile;
