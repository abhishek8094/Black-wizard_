"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { FaUser, FaHeart } from "react-icons/fa6";
import { searchProduct } from "../redux/slices/productSlice";
import {
  FaSearch,
  FaShoppingCart,
  FaUserCircle,
  FaTimes,
} from "react-icons/fa";
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const pathname = usePathname();
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems);
  const cartItemsCount = useSelector(selectTotalItems);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const isVisible = useSelector(selectAnnouncementVisible);

  const handleLogOut = async () => {
    try {
      const result = await dispatch(logout()).unwrap();
      if (result.success === true) {
        toast.success(result.message);
        doLogout();
        route.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      toast.error("An error occurred during logout");
      console.error("Logout error:", error);
    }
  };

  const totalCartItems = cartItemsCount;

  const [animateBadge, setAnimateBadge] = useState(false);
  const prevCartItemsRef = useRef(totalCartItems);
  const userMenuRef = useRef(null);

  // Search states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchBoxRef = useRef(null);
  const debounceTimeout = useRef(null);

  useEffect(() => {
    if (prevCartItemsRef.current !== totalCartItems) {
      setAnimateBadge(true);
      const timer = setTimeout(() => setAnimateBadge(false), 1000);
      prevCartItemsRef.current = totalCartItems;
      return () => clearTimeout(timer);
    }
  }, [totalCartItems]);

  // Search API call function
  const searchProducts = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoading(true);
    try {
      const result = await dispatch(searchProduct(query)).unwrap()
      setSearchResults(result.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    // Debounce the API call
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      searchProducts(query);
    }, 300);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
        setIsOpenProfile(false);
      }
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const profile = localStorage.getItem("userProfile");
      if (profile) {
        try {
          const parsed = JSON.parse(profile);
          setUserEmail(parsed.email || null);
          setUserRole(parsed.role || null);
        } catch (e) {
          setUserEmail(null);
          setUserRole(null);
        }
      } else {
        setUserEmail(null);
        setUserRole(null);
      }
    }
  }, []);

  const handleClick = () => {
    setIsOpenProfile((prev) => !prev);
  };


  const navigation = [
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
          <div className="hidden md:flex text-gray-700 space-x-6 items-center">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <FaSearch className="text-xl" />
            </button>

            {[
              "/pages/orders",
              "/account/user-profile",
              "/account/settings",
            ].includes(pathname) ? (
              <>
                <Link
                  href="/"
                  className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${
                    pathname === "/"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : ""
                  }`}
                >
                  Shop
                </Link>
                <Link
                  href="/pages/orders"
                  className={`px-3 py-2 text-gray-700 hover:text-blue-600 ${
                    pathname === "/pages/orders"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : ""
                  }`}
                >
                  Orders
                </Link>

                {/* Profile Dropdown */}
                <div
                  className="relative hover:bg-slate-200 rounded-lg"
                  ref={userMenuRef}
                  onClick={() => setIsOpenProfile(!isOpenProfile)}
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
                    <div className="absolute right-0 w-64 bg-white rounded-md shadow-lg py-3 pr-2 z-50 border border-gray-200">
                      {/* Profile Icon & Name */}
                      <div className="flex gap-2  pb-3 ">
                        <FaUserCircle className="w-8 h-8 ml-4 text-gray-500" />
                        <p className=" mt-1 text-sm text-gray-700 font-medium text-center break-words">
                          {userEmail || "No name"}
                        </p>
                      </div>

                      {/* Divider */}
                      <hr className="border-gray-200" />

                      {/* Menu Items */}
                      <div className="pl-3">
                        <Link
                          href="/account/user-profile"
                          className={`px-3 py-2 block text-gray-700 hover:bg-gray-100 ${
                            pathname === "/account/user-profile"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : ""
                          }`}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/account/settings"
                          className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                            pathname === "/account/settings"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : ""
                          }`}
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
                    <button
                      className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <div className="text-xl flex items-center">
                        <FaUser aria-label="Profile" />
                      </div>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                        <button
                          onClick={() => {
                          
                            route.push('/pages/orders');
                              setIsUserMenuOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                            pathname === "/pages/orders"
                              ? "text-blue-600 border-b-2 border-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          Dashboard
                        </button>

                        <Link
                          href="/account/user-profile"
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Addresses
                        </Link>
                        {userRole === 'admin' && (
                          <Link
                            href="/admin"
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Admin
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            handleLogOut();
                            setIsUserMenuOpen(false);
                          }}
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

          {/* Desktop Search Box */}
          {isSearchOpen && (
            <div
              ref={searchBoxRef}
              className="fixed top-12 left-4 right-4 md:left-auto md:right-80 md:w-96 w-full rounded-md z-50 hidden md:block "
            >
              {/* Search input */}
              <div className="flex items-center space-x-2 p-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 pr-8 border text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      aria-label="Clear search"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </div>

              {/* Search results */}
              <div className="absolute left-0 w-full mt-1 bg-white  rounded-md shadow-lg max-h-60 overflow-y-auto">
                {isLoading && (
                  <div className="p-3 text-center text-gray-500">
                    Searching...
                  </div>
                )}

                {searchResults.length > 0 &&
                  searchResults.map((product, index) => (
                    <Link
                      key={index}
                      href={`/collections/products/${product._id}`}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        setSearchResults([]);
                      }}
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                    >
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}

                {searchQuery && !isLoading && searchResults.length === 0 && (
                  <div className="p-3 text-center text-gray-500">
                    No products found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Search"
            >
              <FaSearch className="text-xl" />
            </button>
            {isSearchOpen && (
              <div
                ref={searchBoxRef}
                className="fixed top-24 left-4 right-4 rounded-md z-50 md:hidden w-auto "
              >
                {/* Search input */}
                <div className="flex items-center space-x-2 p-2">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full px-3 py-2 pr-8 border text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label="Clear search"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                </div>

                {/* Search results */}
                <div className="absolute left-0 w-full mt-1 bg-white  rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isLoading && (
                    <div className="p-3 text-center text-gray-500">
                      Searching...
                    </div>
                  )}

                  {searchResults.length > 0 &&
                    searchResults.map((product, index) => (
                      <Link
                        key={index}
                        href={`/collections/products/${product._id}`}
                        onClick={() => {
                          setIsSearchOpen(false);
                          setSearchQuery("");
                          setSearchResults([]);
                        }}
                        className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                      >
                        <div className="flex items-center space-x-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {product.name}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}

                  {searchQuery && !isLoading && searchResults.length === 0 && (
                    <div className="p-3 text-center text-gray-500">
                      No products found
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wishlist Icon */}
            <Link
              href="/pages/wishlist"
              className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Wishlist"
            >
              <FaHeart className="text-xl" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/pages/cart"
              className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              aria-label="Cart"
            >
              <FaShoppingCart className="text-xl" />
              {totalCartItems > 0 && (
                <span className={`absolute -top-1 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full ${animateBadge ? "animate-ping" : ""}`}>
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* User/Profile Icon */}
            {getToken() ? (
              <div
                className="relative"
                ref={userMenuRef}
              >
                <button className="relative flex items-center justify-center px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <div className="text-xl flex items-center">
                    <FaUser aria-label="Profile" />
                  </div>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        route.push('/pages/orders');
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        pathname === "/pages/orders"
                          ? "text-blue-600 border-b-2 border-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      Dashboard
                    </button>

                    <Link
                      href="/account/user-profile"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Addresses
                    </Link>
                    {userRole === 'admin' && (
                      <Link
                        href="/admin"
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogOut();
                        setIsUserMenuOpen(false);
                      }}
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


          </div>
        </div>


      </div>
    </nav>
  );
}
