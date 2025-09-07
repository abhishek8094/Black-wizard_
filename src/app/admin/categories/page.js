"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function AdminCategories() {
  const { userData } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!userData || userData.user.role !== "admin") {
      router.push("/home/login");
    }
  }, [userData, router]);

  // Check if user is admin
  if (!userData || userData.user.role !== "admin") {
    return null;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-700">Manage Categories</h1>
      <div className="bg-white text-gray-700 p-6 rounded shadow">
        <p>Here you can add, edit, and delete categories.</p>
        {/* Placeholder for categories list */}
        <p>Categories list will be implemented here.</p>
      </div>
    </div>
  );
}
