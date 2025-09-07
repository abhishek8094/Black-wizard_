"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboard() {
  const { userData } = useSelector((state) => state.auth);
  const router = useRouter();

  console.log(userData)

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
    <div className="pt-2 pb-6 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-700"> Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/products" className="bg-white text-gray-700 p-6 rounded shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Manage Products</h2>
            <p>Add, edit, delete products</p>
          </Link>
          <Link href="/admin/users" className="bg-white text-gray-700 p-6 rounded shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
            <p>View and edit users</p>
          </Link>
          <Link href="/admin/categories" className="bg-white text-gray-700 p-6 rounded shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Manage Categories</h2>
            <p>Add, edit, delete categories</p>
          </Link>
          <Link href="/admin/explore-collection" className="bg-white text-gray-700 p-6 rounded shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Explore Collection</h2>
            <p>Manage explore collection categories</p>
          </Link>
          <Link href="/admin/crousel" className="bg-white text-gray-700 p-6 rounded shadow hover:shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Carousel</h2>
            <p>Manage carousel images</p>
          </Link>
        </div>
      </div>
    </div>
  );  
}
