import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 md:p-4 bg-white shadow-sm">
      <div className="flex gap-12 justify-center items-center">
        <Link href="/" className="flex items-center">
          <img src="/logo.jpeg" alt="Site Logo" width={80} height={45} />
        </Link>

        {/* Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-gray-700 hover:text-black font-medium"
          >
            Shop
          </Link>
          <Link
            href="/pages/orders"
            className="text-gray-700 hover:text-black font-medium"
          >
            Orders
          </Link>
        </nav>
      </div>

      {/* Account Menu Button */}
      <div className="flex items-center space-x-2 mr-4">
        <button
          type="button"
          className="flex items-center gap-2 text-gray-700 hover:text-black focus:outline-none"
          aria-label="Account menu"
        >
          <FaUserCircle className="w-8 h-8" />
          <IoIosArrowDown className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
