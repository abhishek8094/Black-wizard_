"use client"
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaYoutube,
  FaThreads,
} from "react-icons/fa6";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Brand & Social */}
        <div>
          <img
            src="/logo.jpeg"
            alt="Coitonic Logo"
            className="mb-4 w-40"
          />

          <div className="flex flex-wrap gap-4 mb-4">
            <Link href="#" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </Link>
            <Link href="#">
              <FaTwitter />
            </Link>
            <Link href="https://www.instagram.com/blackwizardsports?igsh=OHpzbnBudTR5ODB4">
              <FaInstagram />
            </Link>
            <Link href="#">
              <FaPinterestP />
            </Link>
            <Link href="#">
              <FaYoutube />
            </Link>
            <Link href="#">
              <FaThreads />
            </Link>
          </div>
          <Link
            href="/contact-us"
            className="inline-block mt-2 px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition"
          >
            Contact Us
          </Link>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/collections?category=Compression%20Fit">Compression Fit</Link></li>
            <li><Link href="/collections?category=Compression%20Fit">Man</Link></li>
             <li><Link href="/collections?category=Compression%20Fit">Socks</Link></li>
            <li><Link href="/contact-us">Contact Us</Link></li>
            <li><Link href="#">FAQ</Link></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-semibold mb-4">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/home/login">Login</Link></li>
            <li><Link href="/home/signup">SignUp</Link></li>
            <li><Link href="/pages/tracking-order">Track Your Order</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#">Facebook</Link></li>
            <li><Link href="#">Twitter</Link></li>
            <li><Link href="https://www.instagram.com/blackwizardsports?igsh=OHpzbnBudTR5ODB4">Instagram</Link></li>
            <li><Link href="#">Snapchat</Link></li>
          </ul>
        </div>
      </div>
       {/* Bottom Footer */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Black-Wizard. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
