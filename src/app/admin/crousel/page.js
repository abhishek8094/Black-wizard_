"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  getCrousel,
  addCarouselItem,
  updateCarouselItem,
  deleteCarouselItem,
} from "@/app/redux/slices/productSlice";
import CarouselModal from "@/app/components/CarouselModal";

export default function AdminCarousel() {
  const { userData } = useSelector((state) => state.auth);
  const { carouselData, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [modalKey, setModalKey] = useState(0);

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
    dispatch(getCrousel());
  }, [userRole, dispatch, router]);

  // Check if user is admin
  if (userRole !== "admin") {
    return null;
  }

  const handleAdd = () => {
    setIsEditing(true);
    setEditingId(null);
    setImageUrl("");
    setUploadedFile(null);
    setModalKey((prev) => prev + 1); // Reset modal state by changing key
  };

  const handleEdit = (id, url) => {
    setIsEditing(true);
    setEditingId(id);
    setImageUrl(url);
    setModalKey((prev) => prev + 1); // Reset modal state by changing key
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this carousel item?")) {
      const result = await dispatch(deleteCarouselItem({ id: id })).unwrap();
      if (result.success === true) {
        toast.success(result.message);
        await dispatch(getCrousel());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        if (uploadedFile) {
          // Send FormData with file and id for update
          const data = new FormData();
          data.append('id', editingId);
          data.append('image', uploadedFile);
          const result = await dispatch(updateCarouselItem(data)).unwrap();
          if (result.success === true) {
            toast.success(result.message);
          }
        } else {
          // Send JSON payload with id and imageUrl for update
          const result = await dispatch(updateCarouselItem({ id: editingId, imageUrl })).unwrap();
          if (result.success === true) {
            toast.success(result.message);
          }
        }
      } else {
        if (uploadedFile) {
          // Send FormData with file for add
          const data = new FormData();
          data.append('image', uploadedFile);
          const result = await dispatch(addCarouselItem(data)).unwrap();
          if (result.success === true) {
            toast.success(result.message);
          }
        } else {
          const result = await dispatch(addCarouselItem({ imageUrl })).unwrap();
          if (result.success === true) {
            toast.success(result.message);
          }
        }
      }
      // Close modal after add or update
      setIsEditing(false);
      setEditingId(null);
      setImageUrl("");
      setUploadedFile(null);
      dispatch(getCrousel());
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setImageUrl("");
    setUploadedFile(null);
    setModalKey((prev) => prev + 1); // Reset modal state by changing key
  };

  return (
    <div className="pt-2 pb-6 px-2 sm:px-6 bg-gray-100 text-gray-700 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-nowrap">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-700">Manage Carousel</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
          >
            Add Item
          </button>
        </div>
        <div className="max-w-4xl mx-auto">
          <CarouselModal
            key={modalKey}
            isOpen={isEditing}
            onClose={handleCancel}
            imageUrl={imageUrl}
            setImageUrl={setImageUrl}
            onSubmit={handleSubmit}
            isEdit={!!editingId}
            onFileSelect={setUploadedFile}
          />

          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="bg-white text-gray-700 rounded shadow overflow-hidden hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="p-2 sm:p-4 text-left">Image</th>
                        <th className="p-2 sm:p-4 text-left">URL</th>
                        <th className="p-2 sm:p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {carouselData?.map((item, index) => (
                        <tr key={item.id} className="border-t">
                          <td className="p-2 sm:p-4">
                            <img
                              src={item.imageUrl}
                              alt={`Carousel ${index + 1}`}
                              className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                            />
                          </td>
                          <td className="p-2 sm:p-4">{item.imageUrl}</td>
                          <td className="p-2 sm:p-4">
                            <button
                              onClick={() => handleEdit(item.id, item.imageUrl)}
                              className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded mr-4 inline-block"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
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
                {carouselData?.map((item, index) => (
                  <div key={item.id} className="bg-white rounded shadow p-4 mb-4">
                    <div className="relative mb-2">
                      <img
                        src={item.imageUrl}
                        alt={`Carousel ${index + 1}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <div className="relative bg-opacity-50 justify-start opacity-100 mt-4 hover:opacity-100 transition-opacity duration-300 flex items-center space-x-2 rounded">
                        <button
                          onClick={() => handleEdit(item.id, item.imageUrl)}
                          className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
