"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaHeart } from "react-icons/fa6";
import { FaSearch, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { doLogout } from "../api/auth";

import { logout } from "../redux/slices/authSlice";
import { selectCartItems, selectTotalItems } from "../redux/slices/cartSlice";
import {
  selectWishlistItems,
  selectWishlistCount,
} from "../redux/slices/wishlistSlice";
import { selectAnnouncementVisible } from "../redux/slices/announcementSlice";
import { getToken } from "../api/auth";

export default function Navbar() {
  const route = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const pathname = usePathname();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const cartItemsCount = useSelector(selectTotalItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const isVisible = useSelector(selectAnnouncementVisible);

  const handleLogOut = async () => {
    const result = await dispatch(logout()).unwrap();
    // console.log("result",result);
    if (result.success === true) {
      toast.success(result.message);
      doLogout();
      route.push("/");
    }
  };

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
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
        setIsOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClick = () => {
    setIsOpenProfile((prev) => !prev);
  };

  const currentUser = useSelector((state) => state.auth.userData);

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
            {[
              "/pages/orders",
              "/account/user-profile",
              "/account/settings",
            ].includes(pathname) ? (
              <>
                <Link
                  href="/dashboard/shop"
                  className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${
                    pathname === "/dashboard/shop"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : ""
                  }`}
                >
                  Shop
                </Link>
                <Link
                  href="/dashboard/order"
                  className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${
                    pathname === "/dashboard/order"
                      ? ""
                      : "text-blue-600 border-b-2 border-blue-600"
                  }`}
                >
                  Orders
                </Link>

                {/* Profile Dropdown */}
                <div
                  className="relative hover:bg-slate-200 rounded-lg"
                  ref={userMenuRef}
                  onMouseEnter={() => setIsUserMenuOpen(true)}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  onClick={handleClick}
                >
                  <button className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <div className="text-xl flex items-center space-x-1">
                      <FaUser aria-label="Profile" />
                      <svg
                        className={`w-4 h-4 transform transition-transform duration-200 ${
                          isOpenProfile ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>

                  {isOpenProfile && (
                    <div className="absolute right-0 w-64 bg-white rounded-md shadow-lg py-3 z-50 border border-gray-200">
                      {/* Profile Icon & Email */}
                      <div className="flex  gap-3  pb-3">
                        <FaUserCircle className="w-8 h-8 ml-4 text-gray-500" />
                        <p className=" mt-1 text-sm text-gray-700 font-medium text-center break-words">
                          {currentUser?.email || "guest@example.com"}
                        </p>
                      </div>

                      {/* Divider */}
                      <hr className="border-gray-200" />

                      {/* Menu Items */}
                      <Link
                        href="/account/user-profile"
                        className={`px-3 py-2 block text-gray-700 hover:bg-gray-100 ${
                          pathname === "/account/user-profile"
                            ? ""
                            : "text-blue-600 border-b-2 border-blue-600"
                        }`}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/account/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Default Navigation */}
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
                {/* User Menu (same as before) */}
                {getToken() ? (
                  <div
                    className="relative"
                    ref={userMenuRef}
                    onMouseEnter={() => setIsUserMenuOpen(true)}
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <button className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                      <div className="text-xl">
                        <FaUser aria-label="Profile" />
                      </div>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <Link
                          href="/pages/orders"
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            pathname === "/pages/orders"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          Dashboard
                        </Link>

                        <Link
                          href="/account/user-profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Addresses
                        </Link>
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
                  >
                    <div className="text-xl">
                      <FaUser aria-label="Login" />
                    </div>
                  </Link>
                )}
              </>
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
              {getToken() && (
                <button
                  onClick={handleLogOut}
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
