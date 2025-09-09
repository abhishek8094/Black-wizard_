import React, { useState } from 'react';

const ExploreCollectionModal = ({ isOpen, onClose, onSubmit, productsData, exploreProducts }) => {
  const [selectedProductId, setSelectedProductId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    onSubmit(selectedProductId);
    setSelectedProductId('');
  };

  const handleClose = () => {
    setSelectedProductId('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 text-gray-700 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Add Product to Explore Collection"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            Add Product
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
                {productsData?.filter(p => !exploreProducts.some(ep => ep.id === p._id)).map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - Rs. {product.price}
                  </option>
                ))}
              </select>
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
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExploreCollectionModal;
