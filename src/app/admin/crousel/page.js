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
  };

  const handleEdit = (id, url) => {
    setIsEditing(true);
    setEditingId(id);
    setImageUrl(url);
  };

  const handleDelete = async (id) => {
    console.log("id", id);
    if (confirm("Are you sure you want to delete this carousel item?")) {
      const result = await dispatch(deleteCarouselItem({ id: id })).unwrap();
      console.log(result, "result");
      if (result.success === true) {
        toast.success(result.message);
        await dispatch(getCrousel());
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      if (uploadedFile) {
        // Send FormData with file for update
        const data = new FormData();
        data.append('image', uploadedFile);
        await dispatch(updateCarouselItem({ id: editingId, data }));
      } else {
        await dispatch(updateCarouselItem({ id: editingId, imageUrl }));
      }
    } else {
      if (uploadedFile) {
        // Send FormData with file for add
        const data = new FormData();
        data.append('image', uploadedFile);
        const result = await dispatch(addCarouselItem(data)).unwrap();
        if(result.success === true){
          toast.success(result.message)
        }
      } else {
        await dispatch(addCarouselItem({ imageUrl }));
      }
    }
    setIsEditing(false);
    setEditingId(null);
    setImageUrl("");
    setUploadedFile(null);
    dispatch(getCrousel()); // Refetch after add/update
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setImageUrl("");
    setUploadedFile(null);
  };

  return (
    <div className="pt-4 pb-5 px-6 bg-gray-100 text-gray-700 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Manage Carousel</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <CarouselModal
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
          <div className="bg-white text-gray-700 rounded shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">URL</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {carouselData?.map((item, index) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-4">
                      <img
                        src={item.imageUrl}
                        alt={`Carousel ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-4">{item.imageUrl}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(item.id, item.imageUrl)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-4 inline-block"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
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
