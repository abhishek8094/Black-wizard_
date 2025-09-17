import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const ProductModal = ({ isOpen, onClose, product, onSubmit, isEdit }) => {
  const { productCategorieData } = useSelector((state) => state.product);
  const [previewUrls, setPreviewUrls] = useState([]);
  const fileInputRef = useRef(null);

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Product name is required")
      .min(2, "Product name must be at least 2 characters")
      .max(100, "Product name must be less than 100 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters")
      .max(1000, "Description must be less than 1000 characters"),
    price: Yup.number()
      .required("Price is required")
      .min(0.01, "Price must be greater than 0")
      .max(999999, "Price must be less than 999,999"),
    category: Yup.string()
      .required("Category is required"),
    size: Yup.string()
      .required("Size is required")
      .min(1, "Size is required")
      .max(20, "Size must be less than 20 characters"),
    images: Yup.array()
      .of(Yup.mixed())
      .test("fileSize", "Each file must be less than 5MB", (files) => {
        if (!files || files.length === 0) return !isEdit; // Allow empty for updates
        return files.every(file => file.size <= 5 * 1024 * 1024);
      })
      .test("fileType", "Only image files are allowed", (files) => {
        if (!files || files.length === 0) return !isEdit; // Allow empty for updates
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
        return files.every(file => allowedTypes.includes(file.type));
      })
  });

  // Initial values
  const initialValues = {
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || '',
    size: product?.size || '',
    images: []
  };

  if (!isOpen) return null;

  const handleFileChange = (files, setFieldValue) => {
    const fileArray = Array.from(files);
    setFieldValue("images", fileArray);
    const urls = fileArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...urls]);
  };

  const removeImage = (index, setFieldValue, values) => {
    const newImages = values.images.filter((_, i) => i !== index);
    setFieldValue("images", newImages);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const submitData = new FormData();
    submitData.append('name', values.name);
    submitData.append('description', values.description);
    submitData.append('price', values.price);
    submitData.append('category', values.category);
    submitData.append('size', values.size);
    
    values.images.forEach(file => {
      submitData.append('image', file);
    });
    
    if (isEdit && product) {
      submitData.append('existingImages', JSON.stringify(product.image || []));
    }
    
    onSubmit(submitData);
    setSubmitting(false);
  };

  const handleClose = () => {
    previewUrls?.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? "Edit Product" : "Add Product"}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEdit ? "Edit Product" : "Add Product"}
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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ setFieldValue, isSubmitting, values }) => (
              <Form className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <Field
                    as="textarea"
                    id="description"
                    name="description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <Field
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <Field
                    as="select"
                    id="category"
                    name="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Category</option>
                    {productCategorieData?.map((cat, idx) => (
                      <option key={idx} value={cat.title} className='text-gray-600'>{cat.title}</option>
                    ))}
                  </Field>
                  <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Size */}
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                    Size *
                  </label>
                  <Field
                    id="size"
                    name="size"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="size" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                {/* Images */}
                <div>
                  <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images {!isEdit && "*"}
                  </label>
                  <input
                    id="images"
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e.target.files, setFieldValue)}
                    ref={fileInputRef}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage name="images" component="div" className="text-red-500 text-sm mt-1" />
                  
                  {/* Image Previews */}
                  {previewUrls?.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {previewUrls?.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md border border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index, setFieldValue, values)}
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
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : (isEdit ? "Update Product" : "Add Product")}
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

export default ProductModal;
