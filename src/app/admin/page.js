"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUsers } from "@/app/api/users";
import { getProducts, exploreCollection, trendingProduct } from "@/app/redux/slices/productSlice";

export default function AdminDashboard() {
  const { userData } = useSelector((state) => state.auth);
  const { productsData, exploreData, trendingProductData } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    exploringCount: 0,
    trendingCount: 0,
  });

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
      return;
    }

    // Fetch all data
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await getUsers();
        const users = usersResponse?.data || [];

        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();

    // Dispatch Redux actions
    dispatch(getProducts());
    dispatch(exploreCollection());
    dispatch(trendingProduct());
  }, [userRole, router, dispatch]);

  useEffect(() => {
    setStats(prev => ({
      ...prev,
      totalProducts: productsData?.length || 0,
      exploringCount: exploreData?.length || 0,
      trendingCount: trendingProductData?.length || 0,
    }));
  }, [productsData, exploreData, trendingProductData]);

  // Check if user is admin
  if (userRole !== "admin") {
    return null;
  }

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="text-4xl text-gray-400">{icon}</div>
      </div>
    </div>
  );

  return (
    <div className="pt-2 pb-6 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="👥"
            color="border-blue-500"
          />
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon="📦"
            color="border-green-500"
          />
          <StatCard
            title="Exploring Items"
            value={stats.exploringCount}
            icon="🔍"
            color="border-purple-500"
          />
          <StatCard
            title="Trending Items"
            value={stats.trendingCount}
            icon="📈"
            color="border-orange-500"
          />
        </div>
       
      </div>
    </div>
  );
}
