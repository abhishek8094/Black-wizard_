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
            <a href="https://www.facebook.com/shopcoitonic/" target="_blank" rel="noopener noreferrer">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com/shopcoitonic">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/blackwizardsports?igsh=OHpzbnBudTR5ODB4">
              <FaInstagram />
            </a>
            <a href="https://www.pinterest.com/shopcoitonic/">
              <FaPinterestP />
            </a>
            <a href="https://www.youtube.com/@shopcoitonic">
              <FaYoutube />
            </a>
            <a href="https://www.threads.net/@shopcoitonic">
              <FaThreads />
            </a>
          </div>
          <a
            href="/contact-us"
            className="inline-block mt-2 px-4 py-2 border border-white text-white hover:bg-white hover:text-black transition"
          >
            Contact Us
          </a>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/">Home</a></li>
            <li><a href="/collections?category=Compression%20Fit">Compression Fit</a></li>
            <li><a href="/collections?category=Compression%20Fit">Man</a></li>
             <li><a href="/collections?category=Compression%20Fit">Socks</a></li>
            <li><a href="/pages/contact">Contact Us</a></li>
            <li><a href="/pages/faq">FAQ</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-lg font-semibold mb-4">My Account</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/home/login">Login</a></li>
            <li><a href="/home/signup">SignUp</a></li>
            <li><a href="/pages/tracking-order">Track Your Order</a></li>
            <li><a href="/policies/privacy-policy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://www.facebook.com/shopcoitonic/">Facebook</a></li>
            <li><a href="https://twitter.com/shopcoitonic">Twitter</a></li>
            <li><a href="https://www.instagram.com/blackwizardsports?igsh=OHpzbnBudTR5ODB4">Instagram</a></li>
            <li><a href="https://www.snapchat.com/add/shopcoitonic">Snapchat</a></li>
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
