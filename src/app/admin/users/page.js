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
    <div className="pt-2 pb-6 px-2 sm:px-6 bg-gray-100 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-nowrap">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-700">
            Manage Users
          </h1>
          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
          >
            Add User
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
                      <th className="p-2 sm:p-4 text-left">First Name</th>
                      <th className="p-2 sm:p-4 text-left">Last Name</th>
                      <th className="p-2 sm:p-4 text-left">Email</th>
                      <th className="p-2 sm:p-4 text-left">Password</th>
                      <th className="p-2 sm:p-4 text-left">Role</th>
                      <th className="p-2 sm:p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList?.map((user, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2 sm:p-4">{user.firstName}</td>
                        <td className="p-2 sm:p-4">{user.lastName}</td>
                        <td className="p-2 sm:p-4">{user.email}</td>
                        <td className="p-2 sm:p-4">{user.password}</td>
                        <td className="p-2 sm:p-4">{user.role}</td>
                        <td className="p-2 sm:p-4">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded mr-4 inline-block text-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
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
              {usersList?.map((user, idx) => (
                <div key={idx} className="bg-white rounded shadow p-4 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-700">{user.firstName}</h3>
                    <h3 className="font-bold text-gray-700">{user.lastName}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-gray-600">{user.role}</p>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user._id)}
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

        <UserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          user={editingUser}
        />
      </div>
    </div>
  );
}
