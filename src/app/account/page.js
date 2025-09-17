"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";

export default function AccountPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const loading = useSelector((state) => state.auth.loading);
  const [localProfile, setLocalProfile] = useState(null);
  const [localRole, setLocalRole] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedProfile = localStorage.getItem("userProfile");
        const parsed = storedProfile ? JSON.parse(storedProfile) : null;
        setLocalProfile(parsed);
      } catch (_) {
        setLocalProfile(null);
      }
      const roleFromStorage = localStorage.getItem("userRole") || "";
      setLocalRole(roleFromStorage);
    }
  }, []);

  const handleSignOut = async () => {
    await dispatch(logout());
    router.push("/");
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }


  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 text-gray-800 bg-white">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
         <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-lg">
              {(localProfile?.firstName || "") + (localProfile?.lastName ? ` ${localProfile.lastName}` : "") || userData?.user?.name || userData?.name || ""}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{localProfile?.email || userData?.user?.email || userData?.email || ""}</p>
          </div>
          {(localProfile?.role || localRole) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-lg">{localProfile?.role || localRole}</p>
            </div>
          )}
          
          {(userData?.createdAt || userData?.user?.createdAt) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Account Created</label>
              <p className="mt-1 text-lg">
                {new Date(userData?.createdAt || userData?.user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
          
          {(userData?.lastSignIn || userData?.user?.lastSignIn) && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
              <p className="mt-1 text-lg">
                {new Date(userData?.lastSignIn || userData?.user?.lastSignIn).toLocaleDateString()}
              </p>
            </div>
          )}
        </div> 
        
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Account Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/pages/orders")}
              className="w-full text-left p-3 bg-gray-100 rounded hover:bg-gray-200"
            >
              My Orders
            </button>
            <button
              onClick={() => router.push("/pages/wishlist")}
              className="w-full text-left p-3 bg-gray-100 rounded hover:bg-gray-200"
            >
              My Wishlist
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left p-3 bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
