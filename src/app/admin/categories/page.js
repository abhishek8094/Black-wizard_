"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  productCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/app/redux/slices/productSlice";
import CategoryModal from "./CategoryModal";

export default function AdminCategories() {
  const { userData } = useSelector((state) => state.auth);
  const {
    productCategorieData,
    loading,
    error,
  } = useSelector((state) => state.product);

  //console.log(productCategorieData)
  const dispatch = useDispatch();
  const router = useRouter();

  const getUserRole = () => {
    if (userData?.user?.role) {
      return userData.user.role;
    }
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
  }, [userRole, router]);

  useEffect(() => {
    if (userRole === "admin") {
      dispatch(productCategories());
    }
  }, [userRole, dispatch]);

  // Check if user is admin
  if (userRole !== "admin") {
    return null;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const openAddModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = async (category) => {
    const formData = new FormData();
    formData.append("title", category.title);

    if (category.id) {
      // For update, only append image if a new file is uploaded
      if (category.image && category.image instanceof File) {
        formData.append("image", category.image);
      }
      // If no new image, don't append, let backend keep existing image
      await dispatch(updateCategory({ id: category.id, data: formData })).then(() => {
        closeModal();
        dispatch(productCategories());
      });
    } else {
      // For add, append image if provided
      if (category.image) {
        formData.append("image", category.image);
      }
      await dispatch(addCategory(formData)).then(() => {
        closeModal();
        dispatch(productCategories());
      });
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      dispatch(deleteCategory(id)).then(() => {
        dispatch(productCategories());
      });
    }
  };

  return (
    <div className="pt-4 pb-5 px-6 bg-gray-100 text-gray-700 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Manage Categories</h1>
        <div className="flex space-x-2">
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Category
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <CategoryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          initialData={editingCategory}
        />

        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : !productCategorieData || productCategorieData.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No categories found. Add your first category!</p>
        ) : (
          <div className="bg-white text-gray-700 rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">Category Name</th>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {productCategorieData.map((category,idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{category.title}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                      <img src={category.image} className="w-16 h-16"/>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => openEditModal(category)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-2 inline-block"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
        )}
      </div>
    </div>
  );
}
