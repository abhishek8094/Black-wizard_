"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { getProducts, deleteProduct, addProduct, updateProduct,  productCategories } from "@/app/redux/slices/productSlice";
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

  const handleDelete = async(id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const result = await dispatch(deleteProduct(id)).unwrap();
      if(result.success === true){
        toast.success(result.message);
      }
      await dispatch(getProducts())
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

  const handleSubmit = async(formData) => {
    if (isEdit) {
      formData.append('id', selectedProduct._id);
      const result = await dispatch(updateProduct(formData)).unwrap();
      if(result.success === true){
        toast.success("product Updated Suceesfully")
      }
      await dispatch(getProducts())
    } else {
      const result = await dispatch(addProduct(formData)).unwrap();
      console.log(result)
      if(result.success === true){
        toast.success("Product Added Successfully");
      }
      await dispatch(getProducts())
    }
    setIsModalOpen(false);
    dispatch(getProducts());
  };


  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="pt-2 pb-6 px-2 sm:px-6 bg-gray-100 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-nowrap">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-700">Manage Products</h1>
          <button onClick={openAddModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
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
                      <th className="p-2 sm:p-4 text-left">Category</th>
                      <th className="p-2 sm:p-4 text-left hidden sm:table-cell">Size</th>
                      <th className="p-2 sm:p-4 text-left">Image</th>
                      <th className="p-2 sm:p-4 text-left">Price</th>
                      <th className="p-2 sm:p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsData?.map((product, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2 sm:p-4">{product.name}</td>
                         <td className="p-2 sm:p-4">{product.category}</td>
                        <td className="p-2 sm:p-4 hidden sm:table-cell">{product.size}</td>
                        <td className="p-2 sm:p-4">
                          <img src={product.image} className="w-8 h-8 sm:w-10 sm:h-10"/>
                        </td>
                        <td className="p-2 sm:p-4">RS. {product.price}</td>
                        <td className="p-2 sm:p-4 space-y-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded mr-4 inline-block text-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
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
              {productsData?.map((product, idx) => (
                <div key={idx} className="bg-white rounded shadow p-4 mb-4">
                  <div className="flex items-center mb-2">
                    <img src={product.image} className="w-16 h-16 mr-4" />
                    <div>
                      <h3 className="font-bold text-gray-700">{product.name}</h3>
                      <p className="text-gray-600">{product.category}</p>
                      <p className="text-gray-600">{product.size}</p>
                      <p className="text-gray-600">RS. {product.price}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2 ">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
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
