"use client"
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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

  // Validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("First name is required")
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be less than 50 characters"),
    lastName: Yup.string()
      .required("Last name is required")
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be less than 50 characters"),
    country: Yup.string()
      .required("Country is required"),
    address: Yup.string()
      .required("Address is required")
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must be less than 200 characters"),
    apartmentSuite: Yup.string()
      .max(100, "Apartment/Suite must be less than 100 characters"),
    city: Yup.string()
      .required("City is required")
      .min(2, "City must be at least 2 characters")
      .max(50, "City must be less than 50 characters"),
    state: Yup.string()
      .required("State is required"),
    pinCode: Yup.string()
      .required("PIN code is required")
      .matches(/^[0-9]{6}$/, "PIN code must be 6 digits"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits"),
    defaultAddress: Yup.boolean()
  });

  // Initial values
  const initialValues = {
    firstName: address?.firstName || "",
    lastName: address?.lastName || "",
    country: address?.countryRegion || "India",
    address: address?.address || "",
    apartmentSuite: address?.apartmentSuite || "",
    city: address?.city || "",
    state: address?.state || "",
    pinCode: address?.pinCode || "",
    phone: address?.phone || "",
    defaultAddress: address?.defaultAddress || false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const addressData = {
      firstName: values.firstName,
      lastName: values.lastName,
      countryRegion: values.country,
      address: values.address,
      apartmentSuite: values.apartmentSuite,
      city: values.city,
      state: values.state,
      pinCode: values.pinCode,
      phone: values.phone,
      defaultAddress: values.defaultAddress,
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
      onClose();
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setSubmitting(false);
    }
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                {/* Default Address Checkbox */}
                <div className="flex items-center">
                  <Field
                    type="checkbox"
                    id="defaultAddress"
                    name="defaultAddress"
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
                    Country/region *
                  </label>
                  <Field
                    as="select"
                    id="country"
                    name="country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoComplete="country"
                  >
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      First name *
                    </label>
                    <Field
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="given-name"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Last name *
                    </label>
                    <Field
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="family-name"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Address Line 1 */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Address *
                  </label>
                  <Field
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoComplete="address-line1"
                  />
                  <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Address Line 2 */}
                <div>
                  <label
                    htmlFor="apartmentSuite"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Apartment, suite, etc (optional)
                  </label>
                  <Field
                    id="apartmentSuite"
                    name="apartmentSuite"
                    type="text"
                    placeholder="Apartment, suite, etc (optional)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoComplete="address-line2"
                  />
                  <ErrorMessage name="apartmentSuite" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* City, State, PIN Code */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      City *
                    </label>
                    <Field
                      id="city"
                      name="city"
                      type="text"
                      placeholder="City"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="address-level2"
                    />
                    <ErrorMessage name="city" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      State *
                    </label>
                    <Field
                      as="select"
                      id="state"
                      name="state"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="address-level1"
                    >
                      <option value="">Select State</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="state" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label
                      htmlFor="pinCode"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      PIN code *
                    </label>
                    <Field
                      id="pinCode"
                      name="pinCode"
                      type="text"
                      placeholder="PIN code"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="postal-code"
                    />
                    <ErrorMessage name="pinCode" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone *
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
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Phone"
                      className="flex-1 px-3 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoComplete="tel"
                    />
                  </div>
                  <ErrorMessage name="phone" component="div" className="text-red-500 text-sm mt-1" />
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
                      disabled={isSubmitting || loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting || loading ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
