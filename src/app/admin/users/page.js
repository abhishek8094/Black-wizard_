"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUsers, removeUser } from "../../redux/slices/usersSlice";
import UserModal from "../../components/UserModal";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const { userData } = useSelector((state) => state.auth);
  const { usersList, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

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
    } else {
      dispatch(fetchUsers());
    }
  }, [userRole, router, dispatch]);

  if (userRole !== "admin") {
    return null;
  }

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async(id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = await dispatch(removeUser(id)).unwrap();
      if(result.success === true){
        toast.success(result.message);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700">
          Manage Users
        </h1>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
        >
          Add User
        </button>
      </div>

      <div className="bg-white text-gray-700 p-4 sm:p-6 rounded shadow">

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm sm:text-base">
                    First Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm sm:text-base">
                    Email
                  </th>
                   <th className="px-4 py-2 text-left text-sm sm:text-base">
                    Password
                  </th>
                  <th className="px-4 py-2 text-left text-sm sm:text-base">
                    Role
                  </th>
                  <th className="px-4 py-2 text-left text-sm sm:text-base">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {usersList?.map((user, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-sm sm:text-base break-words">
                      {user.firstName}
                    </td>
                    <td className="border px-4 py-2 text-sm sm:text-base break-words">
                      {user.email}
                    </td>
                     <td className="border px-4 py-2 text-sm sm:text-base break-words">
                      
                    </td>
                    <td className="border px-4 py-2 text-sm sm:text-base">
                      {user.role}
                    </td>
                    <td className="border px-4 py-2 ">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={editingUser}
      />
    </div>
  );
}
