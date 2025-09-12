"use client";

import React, { useState, useEffect } from "react";

export default function CategoryModal({ isOpen, onClose, onSubmit, initialData }) {
  console.log("in",initialData)
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  console.log(image)
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setImage(null); // Reset image file state
      setImagePreview(initialData.image || "");
    } else {
      setTitle("");
      setImage(null);
      setImagePreview("");
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      alert("Category title is required");
      return;
    }
    onSubmit({ title: title ,image:image });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={initialData ? "Edit Category" : "Add Category"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            {initialData ? "Edit Category" : "Add Category"}
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
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Category Name */}
            <div>
              <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                id="categoryName"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category title"
                required
              />
            </div>

            {/* Category Image */}
            <div>
              <label htmlFor="categoryImage" className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>
              <input
                id="categoryImage"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImage(file);
                    const reader = new FileReader();
                    reader.onload = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {initialData ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
