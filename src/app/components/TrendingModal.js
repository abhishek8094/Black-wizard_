import React, { useEffect, useState } from 'react';

const TrendingModal = ({ isOpen, onClose, onSubmit, isEdit, product, productsData }) => {
  const [imagePreview, setImagePreview] = useState('');
  const [subImgPreview, setSubImgPreview] = useState('');
  const [formData, setFormData] = useState({
    name: product?.name || product?.title || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    size: product?.size || '',
    image: null,
    subImg: null
  });

  useEffect(() => {
    // Sync form when editing a different product or opening
    setFormData({
      name: product?.name || product?.title || '',
      description: product?.description || '',
      price: product?.price || '',
      category: product?.category || '',
      size: product?.size || '',
      image: null,
      subImg: null
    });
    setImagePreview('');
    setSubImgPreview('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubImgChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, subImg: file }));
    setSubImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('description', formData.description);
    submitData.append('price', formData.price);
    submitData.append('category', formData.category);
    submitData.append('size', formData.size);
    if (formData.image) submitData.append('image', formData.image);
    if (formData.subImg) submitData.append('subImg', formData.subImg);
    onSubmit(submitData, product?.id);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-gray-600 bg-black bg-opacity-50">
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
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                
              >
                <option value="">Select Category</option>
                {productsData?.map((cat, idx) => (
                  <option key={idx} value={cat.category}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                Size
              </label>
              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Image */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Sub Image */}
            <div>
              <label htmlFor="subImg" className="block text-sm font-medium text-gray-700 mb-2">
                Sub Image
              </label>
              <input
                id="subImg"
                type="file"
                accept="image/*"
                onChange={handleSubImgChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
              >
                {isEdit ? "Update Product" : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrendingModal;
