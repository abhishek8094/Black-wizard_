"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaHeart } from "react-icons/fa6";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/utils/firebase";
import { useAnnouncement } from "../context/AnnouncementContext";
import { logout } from "../redux/slices/authSlice";

export default function Navbar({ onShowHeaderView }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems, items: cartItems } = useCart();
  const { getWishlistCount, wishlistItems } = useWishlist();
  const { isVisible } = useAnnouncement();

  // Update wishlist count when wishlist items change
  useEffect(() => {
    setWishlistCount(getWishlistCount());
  }, [wishlistItems, getWishlistCount]);


  const handleLogOut = async () => {
    await dispatch(logout());
  };

  // Update cart count when cart items change
  useEffect(() => {
    setCartItemsCount(getTotalItems());
  }, [cartItems, getTotalItems]);

  const totalCartItems = cartItemsCount;

  const [animateBadge, setAnimateBadge] = useState(false);
  const prevCartItemsRef = useRef(totalCartItems);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (prevCartItemsRef.current !== totalCartItems) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 1000);
      prevCartItemsRef.current = totalCartItems;
      return () => clearTimeout(timer);
    }
  }, [totalCartItems]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const navigation = [
    {
      name: "Search",
      href: "/products",
      icon: <FaSearch aria-label="Search" />,
    },
    {
      name: "Wishlist",
      href: "/pages/wishlist",
      icon: <FaHeart aria-label="Wishlist" />,
      badge: wishlistCount,
    },
    {
      name: "Cart",
      href: "/pages/cart",
      icon: <FaShoppingCart aria-label="Cart" />,
      badge: totalCartItems,
      animate: animateBadge,
    },
  ];

  return (
    <nav className="bg-white shadow-md  w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.jpeg" alt="Site Logo" width={80} height={45} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors ${
                  pathname === item.href
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : ""
                }`}
                aria-label={item.name}
              >
                <div className="text-xl">{item.icon}</div>
                {item.badge > 0 && (
                  <span
                    className={`absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full ${
                      item.animate ? "animate-ping" : ""
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            {/* User Menu */}
            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  aria-label="User menu"
                >
                  <div className="text-xl">
                    <FaUser aria-label="Profile" />
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0  w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500"></p>
                      <Link
                        href="/pages/orders"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Link>
                      <p className="text-sm text-gray-400"></p>
                      <Link
                        href="/account/user-profile"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                        }}
                      >
                        Addresses
                      </Link>
                    </div>
                    <button
                      onClick={handleLogOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/home/login"
                className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                aria-label="Login"
              >
                <div className="text-xl">
                  <FaUser aria-label="Login" />
                </div>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md rounded-md">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative flex items-center justify-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${
                    pathname === item.href ? "bg-blue-50 text-blue-600" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                  aria-label={item.name}
                >
                  <div className="text-xl">{item.icon}</div>
                  {item.badge > 0 && (
                    <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              {currentUser && (
                <button
                  onClick={async () => {
                    await signOut(auth);
                    router.push("/");
                  }}
                  className="w-full text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
