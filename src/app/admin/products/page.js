"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { getProducts, deleteProduct, addProduct, updateProduct, getProductById, productCategories } from "@/app/redux/slices/productSlice";
import ProductModal from "@/app/components/ProductModal";

export default function AdminProducts() {
  const { userData } = useSelector((state) => state.auth);
  const { productsData, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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
      }
      dispatch(getProducts());
      dispatch(productCategories());
    }, [userRole, dispatch, router]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  const openAddModal = () => {
    setIsEdit(false);
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (isEdit) {
      dispatch(updateProduct({ id: selectedProduct._id, ...Object.fromEntries(formData) }));
    } else {
      dispatch(addProduct(Object.fromEntries(formData)));
    }
    setIsModalOpen(false);
    dispatch(getProducts());
  };


  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="pt-2 pb-6 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Manage Products</h1>
          <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Product
          </button>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white text-gray-700 rounded shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData?.map((product, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">RS. {product.price}</td>
                      <td className="p-4">
                        <button
                          onClick={() => openEditModal(product)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-4 inline-block text-center"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded inline-block"
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
        )}
        <ProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          onSubmit={handleSubmit}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
}
