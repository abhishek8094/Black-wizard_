"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdShoppingCart, MdPeople, MdCategory, MdExplore, MdTrendingUp, MdPhone, MdViewCarousel, MdReceipt, MdLocationOn } from 'react-icons/md';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: MdDashboard },
    { href: "/admin/products", label: "Products", icon: MdShoppingCart },
    { href: "/admin/users", label: "Users", icon: MdPeople },
    { href: "/admin/categories", label: "Categories", icon: MdCategory },
    { href: "/admin/explore-collection", label: "Explore Collection", icon: MdExplore },
    { href: "/admin/trending", label: "Trending Products", icon: MdTrendingUp },
    { href: "/admin/crousel", label: "Carousel", icon: MdViewCarousel },
    { href: "/admin/orders", label: "Orders", icon: MdReceipt },
    { href: "/admin/addresses", label: "Addresses", icon: MdLocationOn },
    { href: "/admin/contact", label: "Contact", icon: MdPhone },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:block`}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-700">Admin Panel</h2>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-gray-700 hover:bg-gray-200 ${
                pathname === item.href ? "bg-gray-200 font-semibold" : ""
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="inline mr-2 w-5 h-5" /> {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-0">
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden fixed top-0 left-4 z-50 bg-white p-2 rounded shadow-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
