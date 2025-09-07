"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { trendingProduct, addTrendingProduct, updateTrendingProduct, deleteTrendingProduct, getProducts } from "@/app/redux/slices/productSlice";

export default function AdminTrending() {
  const { userData } = useSelector((state) => state.auth);
  const { trendingProductData, productsData, loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();

  const [isAdding, setIsAdding] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    if (!userData || userData.user.role !== "admin") {
      router.push("/home/login");
      return;
    }
    dispatch(trendingProduct());
    dispatch(getProducts());
  }, [userData, dispatch, router]);

  const handleDelete = (productId) => {
    if (confirm("Are you sure you want to remove this product from trending?")) {
      dispatch(deleteTrendingProduct(productId));
      dispatch(trendingProduct()); // Refetch
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedProductId) return;
    const product = productsData.find(p => p._id === selectedProductId);
    if (!product) return;
    await dispatch(addTrendingProduct({ productId: selectedProductId }));
    setIsAdding(false);
    setSelectedProductId("");
    dispatch(trendingProduct()); // Refetch
  };

  if (!userData || userData.user.role !== "admin") return null;

  return (
    <div className="pt-2 pb-6 px-6 bg-gray-100 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Manage Trending Products</h1>
          <div className="flex space-x-2">

            <button
              onClick={() => setIsAdding(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Product
            </button>
          </div>
        </div>

        {isAdding && (
          <form onSubmit={handleAdd} className="mb-6 p-4 border rounded bg-gray-50">
            <h2 className="text-lg font-semibold mb-4">Add Product to Trending</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Select Product</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Choose a product...</option>
                {productsData?.filter(p => !trendingProductData?.some(tp => tp._id === p._id)).map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name} - Rs. {product.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setSelectedProductId(""); }}
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
                  {trendingProductData?.map((product, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-4">{product.title || product.name}</td>
                      <td className="p-4">Rs. {product.price}</td>
                      <td className="p-4">
                        <Link href={`/admin/products/${product._id}`} className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded mr-4 inline-block text-center">
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
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
