"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/app/utils/firebase";

export default function AccountPage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUserData({
          name: user.displayName || "Not provided",
          email: user.email,
          createdAt: user.metadata.creationTime,
          lastSignIn: user.metadata.lastSignInTime
        });
      } else {
        // User is not signed in, redirect to login
        router.push("/login");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (!userData) {
    return null; // Will redirect to login
  }

  return (
    <div className="max-w-4xl mx-auto mt-20 p-6 text-gray-800 bg-white">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-lg">{userData.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{userData.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Account Created</label>
            <p className="mt-1 text-lg">
              {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {userData.lastSignIn && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Sign In</label>
              <p className="mt-1 text-lg">
                {new Date(userData.lastSignIn).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-lg font-semibold mb-3">Account Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => router.push("/orders")}
              className="w-full text-left p-3 bg-gray-100 rounded hover:bg-gray-200"
            >
              My Orders
            </button>
            <button
              onClick={() => router.push("/wishlist")}
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
