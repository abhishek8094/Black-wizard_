import React, { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CarouselModal = ({ isOpen, onClose, imageUrl, setImageUrl, onSubmit, isEdit, onFileSelect }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);

  // Validation schema
  const validationSchema = Yup.object({
    image: Yup.mixed()
      .test("fileSize", "File size must be less than 5MB", (value) => {
        if (!value) return !isEdit; // Allow empty for updates, require for new items
        return value.size <= 5 * 1024 * 1024;
      })
      .test("fileType", "Only image files are allowed", (value) => {
        if (!value) return !isEdit; // Allow empty for updates, require for new items
        return value && ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(value.type);
      })
  });

  // Initial values
  const initialValues = {
    image: null
  };

  if (!isOpen) return null;

  const handleFileChange = (file, setFieldValue) => {
    if (file) {
      setFieldValue("image", file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setImageUrl(url); 
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const event = new Event('submit');
    onSubmit(event);
    setSubmitting(false);
  };

  const handleClose = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit Carousel Item" : "Add Carousel Item"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Carousel Item" : "Add Carousel Item"}
          </h1>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                {/* Image Preview */}
                {(imageUrl || previewUrl) && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Preview
                    </label>
                    <img
                      src={previewUrl || imageUrl}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-md border border-gray-300"
                    />
                  </div>
                )}

                {/* File Upload */}
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image from Device {!isEdit && "*"}
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      handleFileChange(file, setFieldValue);
                    }}
                    ref={fileInputRef}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="image" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || (!imageUrl && !previewUrl)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : (isEdit ? "Update" : "Add")}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CarouselModal;
