import React, { useState, useRef, useEffect } from 'react';

const TrendingModal = ({ isOpen, onClose, onSubmit, isEdit, product, productsData }) => {
  const [selectedProductId, setSelectedProductId] = useState(product?._id || '');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedSubImages, setUploadedSubImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [subImagePreviews, setSubImagePreviews] = useState(product?.subImages || []);
  const imageInputRef = useRef(null);
  const subImageInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setSelectedProductId(product._id || '');
      setImagePreview(product.image || '');
      setSubImagePreviews(product.subImages || []);
    } else {
      setSelectedProductId('');
      setImagePreview('');
      setSubImagePreviews([]);
    }
  }, [product]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setUploadedSubImages(prev => [...prev, ...files]);
    setSubImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeSubImage = (index) => {
    setUploadedSubImages(prev => prev.filter((_, i) => i !== index));
    setSubImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      // Revoke object URLs to prevent memory leaks
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('productId', selectedProductId);
    if (uploadedImage) {
      formData.append('image', uploadedImage);
    }
    uploadedSubImages.forEach((file, index) => {
      formData.append(`subImages`, file);
    });

    onSubmit(formData, isEdit ? product._id : null);
  };

  const handleClose = () => {
    // Clean up object URLs
    if (imagePreview && !product?.image) {
      URL.revokeObjectURL(imagePreview);
    }
    subImagePreviews.forEach(url => {
      if (!product?.subImages?.includes(url)) {
        URL.revokeObjectURL(url);
      }
    });
    setUploadedImage(null);
    setUploadedSubImages([]);
    setImagePreview('');
    setSubImagePreviews([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center text-gray-700  p-4 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit Trending Product" : "Add Trending Product"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Trending Product" : "Add Trending Product"}
          </h1>
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Product Selection */}
            <div>
              <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <select
                id="productSelect"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose a product...</option>
                {productsData?.filter(p => !isEdit || p._id === product._id || !product).map((prod) => (
                  <option key={prod._id} value={prod._id}>
                    {prod.name} - Rs. {prod.price}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Main Image Preview"
                    className="w-full h-32 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={imageInputRef}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sub Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Images (Multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleSubImageChange}
                ref={subImageInputRef}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {subImagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {subImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Sub Image ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeSubImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={!selectedProductId}
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrendingModal;
