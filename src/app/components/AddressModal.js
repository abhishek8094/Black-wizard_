"use client"
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { countries } from "../constant/constant";
import { indianStates } from "../constant/constant";
import {
  addAddress,
  updateAddress,
  deleteAddress,
  fetchAddresses,
} from "../redux/slices/addressSlice";

const AddressModal = ({ isOpen, onClose, address }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.address);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "India",
    address: "",
    apartmentSuite: "",
    city: "",
    state: "",
    pinCode: "",
    phone: "",
    defaultAddress: false,
  });

  useEffect(() => {
    if (address) {
      setFormData({
        firstName: address.firstName || "",
        lastName: address.lastName || "",
        country: address.countryRegion || "India",
        address: address.address || "",
        apartmentSuite: address.apartmentSuite || "",
        city: address.city || "",
        state: address.state || "",
        pinCode: address.pinCode || "",
        phone: address.phone || "",
        defaultAddress: address.defaultAddress || false,
      });
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        country: "India",
        address: "",
        apartmentSuite: "",
        city: "",
        state: "",
        pinCode: "",
        phone: "",
        defaultAddress: false,
      });
    }
  }, [address]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const addressData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      countryRegion: formData.country,
      address: formData.address,
      apartmentSuite: formData.apartmentSuite,
      city: formData.city,
      state: formData.state,
      pinCode: formData.pinCode,
      phone: formData.phone,
      defaultAddress: formData.defaultAddress,
    };

    try {
      if (address) {
        await dispatch(
          updateAddress({ id: address._id, addressData })
        ).unwrap();
        await dispatch(fetchAddresses());
      } else {
        await dispatch(addAddress(addressData)).unwrap();
        await dispatch(fetchAddresses());
      }
    } catch (error) {
      console.error("Failed to save address:", error);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await dispatch(deleteAddress(address._id)).unwrap();
        onClose();
      } catch (error) {
        console.error("Failed to delete address:", error);
      }
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 text-gray-800  flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Add address"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {address ? "Edit address" : "Add address"}
          </h2>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 14"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                d="M2.5 2.5 7 7m4.5 4.5L7 7m0 0 4.5-4.5M7 7l-4.5 4.5"
              ></path>
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Default Address Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="defaultAddress"
                name="defaultAddress"
                checked={formData.defaultAddress}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="defaultAddress"
                className="ml-2 text-sm text-gray-700"
              >
                This is my default address
              </label>
            </div>

            {/* Country Selection */}
            <div>
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country/region
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="country"
              >
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="given-name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="family-name"
                  required
                />
              </div>
            </div>

            {/* Address Line 1 */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="address-line1"
                required
              />
            </div>

            {/* Address Line 2 */}
            <div>
              <label
                htmlFor="apartmentSuite"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Apartment, suite, etc (optional)
              </label>
              <input
                id="apartmentSuite"
                name="apartmentSuite"
                type="text"
                placeholder="Apartment, suite, etc (optional)"
                value={formData.apartmentSuite}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoComplete="address-line2"
              />
            </div>

            {/* City, State, PIN Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="address-level2"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="address-level1"
                  required
                >
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="pinCode"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  PIN code
                </label>
                <input
                  id="pinCode"
                  name="pinCode"
                  type="text"
                  placeholder="PIN code"
                  value={formData.pinCode}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="postal-code"
                  required
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone
              </label>
              <div className="flex">
                <select
                  className="w-20 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  defaultValue="+91"
                >
                  <option value="+91">+91</option>
                  <option value="+1">+1</option>
                  <option value="+44">+44</option>
                  <option value="+86">+86</option>
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <div>
                {address && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    Delete
                  </button>
                )}
              </div>
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
