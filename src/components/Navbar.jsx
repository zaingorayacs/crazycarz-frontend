import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiMoon,
  FiSun,
  FiHome,
  FiInfo,
  FiMail,
} from "react-icons/fi";
import useCartWishlist from "../hooks/useCartWishlist";
import SearchBar from "./SearchBar";

// Dark Mode Toggle
const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initial = stored === "dark" || (!stored && prefersDark);
    setIsDarkMode(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggle = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
    >
      {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
    </button>
  );
};

const Navbar = () => {
  // Get cart and wishlist data using centralized hook
  const { cartItems, wishlistItems, getStats } = useCartWishlist();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = { name: "John" };

  const stats = getStats();
  const totalItems = stats.cart.totalItems;
  const wishlistCount = stats.wishlist.itemCount;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  useEffect(() => {
    const close = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const navLinks = [
    { name: "Home", to: "/", icon: FiHome },
    { name: "About", to: "/about", icon: FiInfo },
    { name: "Contact", to: "/contact", icon: FiMail },
  ];

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-inter">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100"
        >
          CrazyCars
        </Link>

        {/* Search (Desktop) */}
        <div className="hidden md:flex flex-grow max-w-2xl mx-6">
          <SearchBar className="w-full" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((l) => (
            <Link
              key={l.name}
              to={l.to}
              className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            >
              {l.name}
            </Link>
          ))}

          <DarkModeToggle />

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="relative p-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FiHeart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                {wishlistCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <FiShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User */}
          {!isAuthenticated ? (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Sign In
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiUser size={20} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700"
                  >
                    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                      {user?.name || "Profile"}
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center space-x-2">
          <DarkModeToggle />
          <button onClick={() => setMobileOpen(true)} className="p-2">
            <FiMenu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 pointer-events-auto"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg z-50 p-4"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800 dark:text-gray-200">
                  Menu
                </h2>
                <button onClick={() => setMobileOpen(false)}>
                  <FiX size={22} />
                </button>
              </div>

              <div className="space-y-3">
                {navLinks.map((l) => (
                  <Link
                    key={l.name}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <div className="flex items-center space-x-2">
                      <l.icon /> <span>{l.name}</span>
                    </div>
                  </Link>
                ))}

                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <FiHeart /> <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-1.5">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setMobileOpen(false)}
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <FiShoppingCart /> <span>Cart</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="bg-red-600 text-white text-xs rounded-full px-1.5">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700"
                  >
                    Sign In
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;