"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchUsers, removeUser } from "../../redux/slices/usersSlice";
import UserModal from "../../components/UserModal";

export default function AdminUsers() {
  const { userData } = useSelector((state) => state.auth);
  const { usersList, loading } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    if (!userData || userData.user.role !== "admin") {
      router.push("/home/login");
    } else {
      dispatch(fetchUsers());
    }
  }, [userData, router, dispatch]);

  // Check if user is admin
  if (!userData || userData.user.role !== "admin") {
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

  const handleDeleteUser = (id) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(removeUser(id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Manage Users</h1>
      <div className="bg-white text-gray-700 p-6 rounded shadow">
        <button
          onClick={handleAddUser}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add User
        </button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList?.map((user, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.role}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="px-2 py-1 bg-red-500 text-white rounded"
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
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={editingUser}
      />
    </div>
  );
}
