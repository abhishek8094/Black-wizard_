"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { exploreCollection, addExploreCollection, deleteExploreCollection, updateExploreCollection } from "@/app/redux/slices/exploreCollectionSlice";
import ExploreCollectionModal from "@/app/components/ExploreCollectionModal";
import ProductModal from "@/app/components/ProductModal";

export default function AdminExploreCollection() {
  const { userData } = useSelector((state) => state.auth);
  const { exploreData, loading } = useSelector((state) => state.exploreCollection);
  const { productsData } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
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
    dispatch(exploreCollection());
    // Removed dispatch(getProducts());
  }, [userRole, dispatch, router]);

  const handleDelete = (productId) => {
    if (confirm("Are you sure you want to remove this product from the explore collection?")) {
      dispatch(deleteExploreCollection(productId)).then(() => {
        dispatch(exploreCollection());
      });
    }
  };

  const handleAdd = async (formData) => {
    if (!formData) return;

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('image', formData.image);
    data.append('size', formData.size);

    dispatch(addExploreCollection(data)).then(() => {
      setIsModalOpen(false);
      dispatch(exploreCollection());
    });
  };

  const handleEdit = (product) => {
    // Since exploreCollectionSlice does not have getProductById, we can set selectedProduct directly
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (formData) => {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    if (formData.image) {
      data.append('image', formData.image);
    }
    data.append('id', selectedProduct.id);
    dispatch(updateExploreCollection(data)).then(() => {
      setEditModalOpen(false);
      setSelectedProduct(null);
      dispatch(exploreCollection());
    });
  };

  const exploreProducts = exploreData?.["All"] || [];

  if (userRole !== "admin") return null;

  return (
    <div className="pt-2 pb-6 px-2 sm:px-6 bg-gray-100 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-nowrap">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-700">Manage Explore Collection</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded whitespace-nowrap hover:bg-blue-700 text-sm sm:text-base"
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
                      <th className="p-2 sm:p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exploreProducts.map((product, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2 sm:p-4">{product.title || product.name}</td>
                        <td className="p-2 sm:p-4">Rs. {product.price}</td>
                        <td className="p-2 sm:p-4">
                          <button onClick={() => handleEdit(product)} className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded mr-4 inline-block text-center">
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
              {exploreProducts.map((product, idx) => (
                <div key={idx} className="bg-white rounded shadow p-4 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-700">{product.title || product.name}</h3>
                    <p className="text-gray-600">Rs. {product.price}</p>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button onClick={() => handleEdit(product)} className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex-1 text-center">
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

      <ExploreCollectionModal
        isOpen={isModalOpen || editModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={editModalOpen ? handleEditSubmit : handleAdd}
        isEdit={editModalOpen}
        initialData={editModalOpen ? selectedProduct : null}
        productsData={productsData}
        exploreProducts={exploreProducts}
      />
    </div>
  );
}
