"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProducts, deleteProduct } from "@/app/redux/slices/productSlice";

export default function AdminProducts() {
  const { userData } = useSelector((state) => state.auth);
  const { productsData, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!userData || userData.user.role !== "admin") {
      router.push("/home/login");
      return;
    }
    dispatch(getProducts());
  }, [userData, dispatch, router]);

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (!userData || userData.user.role !== "admin") return null;

  return (
    <div className="pt-2 pb-6 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Manage Products</h1>
          <Link href="/admin/products/add" className="bg-blue-600 text-gra text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Product
          </Link>
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white text-gray-700 rounded shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData?.map((product, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">${product.price}</td>
                      <td className="p-4">
                        <Link href={`/admin/products/${product._id}`} className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-4 inline-block text-center">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
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
          </div>
        )}
      </div>
    </div>
  );
}
