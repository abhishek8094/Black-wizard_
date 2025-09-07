"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getCrousel, addCarouselItem, updateCarouselItem, deleteCarouselItem } from "@/app/redux/slices/productSlice";

export default function AdminCarousel() {
  const { userData } = useSelector((state) => state.auth);
  const { carouselData, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!userData || userData.user.role !== "admin") {
      router.push("/home/login");
      return;
    }
    dispatch(getCrousel());
  }, [userData, dispatch, router]);

  if (!userData || userData.user.role !== "admin") return null;

  const handleAdd = () => {
    setIsEditing(true);
    setEditingId(null);
    setImageUrl("");
  };

  const handleEdit = (id, url) => {
    setIsEditing(true);
    setEditingId(id);
    setImageUrl(url);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this carousel item?")) {
      await dispatch(deleteCarouselItem(id));
      dispatch(getCrousel()); // Refetch after delete
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await dispatch(updateCarouselItem({ id: editingId, imageUrl }));
    } else {
      await dispatch(addCarouselItem({ imageUrl }));
    }
    setIsEditing(false);
    setEditingId(null);
    setImageUrl("");
    dispatch(getCrousel()); // Refetch after add/update
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setImageUrl("");
  };

  return (
    <div className="pt-4 pb-5 px-6 bg-gray-100 min-h-screen">
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
      

        {isEditing && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Carousel Item" : "Add Carousel Item"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {editingId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

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
                {carouselData?.map((url, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4">
                      <img
                        src={url}
                        alt={`Carousel ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="p-4">{url}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleEdit(index, url)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-4 inline-block"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(index)}
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
