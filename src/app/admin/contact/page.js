"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchContacts, removeContact } from "../../redux/slices/contactSlice";
import ContactModal from "../../components/ContactModal";
import { toast } from "react-toastify";

export default function AdminContacts() {
  const { userData } = useSelector((state) => state.auth);
  const { contactsList, loading } = useSelector((state) => state.contacts);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

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
      dispatch(fetchContacts());
    }
  }, [userRole, router, dispatch]);

  if (userRole !== "admin") {
    return null;
  }

  const handleAddContact = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteContact = async (id) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      const result = await dispatch(removeContact(id)).unwrap();
      if (result.success === true) {
        toast.success(result.message);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  return (
    <div className="pt-2 pb-6 px-2 sm:px-6 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-nowrap">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-700">
            Manage Contacts
          </h1>
          <button
            onClick={handleAddContact}
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm sm:text-base"
          >
            Add Contact
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
                      <th className="p-2 sm:p-4 text-left">Email</th>
                      <th className="p-2 sm:p-4 text-left">Subject</th>
                      <th className="p-2 sm:p-4 text-left">Message</th>
                      <th className="p-2 sm:p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactsList?.map((contact, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2 sm:p-4">{contact.name}</td>
                        <td className="p-2 sm:p-4">{contact.email}</td>
                        <td className="p-2 sm:p-4">{contact.subject}</td>
                        <td className="p-2 sm:p-4 max-w-xs truncate">{contact.message}</td>
                        <td className="p-2 sm:p-4">
                          <button
                            onClick={() => handleEditContact(contact)}
                            className="text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 sm:px-3 sm:py-1 rounded mr-4 inline-block text-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteContact(contact._id)}
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
              {contactsList?.map((contact, idx) => (
                <div key={idx} className="bg-white rounded shadow p-4 mb-4">
                  <div>
                    <h3 className="font-bold text-gray-700">{contact.name}</h3>
                    <p className="text-gray-600">{contact.email}</p>
                    <p className="text-gray-600 font-semibold">{contact.subject}</p>
                    <p className="text-gray-600">{contact.message}</p>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditContact(contact)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact._id)}
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

        <ContactModal
          isOpen={isModalOpen}
          onClose={closeModal}
          contact={editingContact}
        />
      </div>
    </div>
  );
}
