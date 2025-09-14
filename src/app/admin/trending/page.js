"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { trendingProduct, addTrendingProduct, updateTrendingProduct, deleteTrendingProduct, getProducts } from "@/app/redux/slices/productSlice";
import { toast } from "react-toastify";
import TrendingModal from "@/app/components/TrendingModal";


export default function AdminTrending() {
  const { userData } = useSelector((state) => state.auth);
  const { trendingProductData, productsData, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const getUserRole = () => {
    // First check Redux state
    if (userData?.user?.role) {
      return userData.user.role;
    }
    // Fallback to localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole");
    }
    return null;
  };

  const userRole = getUserRole();

  useEffect(() => {
    if (userRole !== "admin") {
      router.push("/home/login");
      return;
    }
    dispatch(trendingProduct());
    dispatch(getProducts());
  }, [userRole, dispatch, router]);

  const handleDelete = async(productId) => {
    if (confirm("Are you sure you want to remove this product from trending?")) {
     const result =  await dispatch(deleteTrendingProduct(productId)).unwrap();
     if(result.success === true){
      toast.success(result.message);
     }
      await dispatch(trendingProduct()); // Refetch
    }
  };

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setIsEditMode(true);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (formData, productId) => {
    try {
      if (isEditMode && productId) {
        formData.append('id', productId);
        await dispatch(updateTrendingProduct(formData)).unwrap();
        toast.success("Trending product updated successfully");
      } else {

        await dispatch(addTrendingProduct(formData)).unwrap();
        toast.success("Product added and set as trending successfully");
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
      dispatch(trendingProduct()); // Refetch
      dispatch(getProducts()); // Refetch products
    } catch (error) {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (userRole !== "admin") return null;

  return (
    <>
      <div className="pt-2 pb-6 px-2 sm:px-6 bg-gray-100 ">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8 flex-nowrap space-x-4">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-700 ">Manage Trending Products</h1>
            <button
              onClick={handleOpenAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base whitespace-nowrap"
            >
              Add Product
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="bg-white text-gray-700 rounded shadow overflow-hidden hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 sm:p-4 text-left">Name</th>
                        <th className="p-2 sm:p-4 text-left">Price</th>
                        <th className="p-2 sm:p-4 text-left">Size</th>
                        <th className="p-2 sm:p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trendingProductData?.map((product, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2 sm:p-4">{product.title || product.name}</td>
                          <td className="p-2 sm:p-4">Rs. {product.price}</td>
                          <td className="p-2 sm:p-4">{product.size || 'N/A'}</td>
                          <td className="p-2 sm:p-4">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded mr-4 inline-block text-center"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
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
                {trendingProductData?.map((product, idx) => (
                  <div key={idx} className="bg-white rounded shadow p-4 mb-4">
                    <div>
                      <h3 className="font-bold text-gray-700">{product.title || product.name}</h3>
                      <p className="text-gray-600">Rs. {product.price}</p>
                      <p className="text-gray-600">{product.size || 'N/A'}</p>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
      <TrendingModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        isEdit={isEditMode}
        product={selectedProduct}
        productsData={productsData}
      />
    </>
  );
}
