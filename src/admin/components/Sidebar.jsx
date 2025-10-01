import React, { useState } from "react";
import "../../index.css";
import analytics from "../assets/analytics.svg";
import close from "../assets/close.svg";
import customer from "../assets/customer.svg";
import dashboard from "../assets/dashboard.svg";
import order from "../assets/order.svg";
import product from "../assets/products.svg";
import setting from "../assets/setting.svg";
import { Plus, Tag, Building2, Package, ChevronDown } from "lucide-react";
import { Link, useParams } from "react-router-dom";

function Sidebar() {
  // State to manage whether the sidebar is minimized or not.
  const [isMinimized, setIsMinimized] = useState(false);
  // State to manage the visibility of the products dropdown
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  
  // Get tenantId from URL params
  const { tenantId } = useParams();
  
  // Helper function to build tenant-aware URLs
  const buildUrl = (path) => {
    if (!tenantId) return path;
    return `/admin/${tenantId}${path}`;
  };

  // Function to toggle the sidebar's minimized state for mobile.
  const toggleSidebar = () => {
    setIsMinimized(!isMinimized);
  };

  // Function to toggle the products dropdown
  const toggleProductsDropdown = () => {
    setIsProductsDropdownOpen(!isProductsDropdownOpen);
  };

  const id = 123;
  return (
    <div className="flex">
      {/* Sidebar */}
      {/* The onMouseEnter and onMouseLeave events handle the hover functionality for the desktop view */}
      <div
        id="hs-sidebar-content-push-to-mini-sidebar"
        className={`
          hs-overlay [--auto-close:lg] lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 
          ${isMinimized ? "w-13" : "w-64"} 
          hs-overlay-open:translate-x-0 -translate-x-full transition-all duration-300 transform 
          h-screen overflow-x-hidden

          bg-white border-e border-gray-200 dark:bg-gray-800 dark:border-gray-700
        `}
        role="dialog"
        tabIndex="-1"
        aria-label="Sidebar"
        // Desktop hover functionality to open and close the sidebar
        onMouseEnter={() => setIsMinimized(false)}
        onMouseLeave={() => setIsMinimized(true)}
      >
        <div className="relative flex flex-col h-full max-h-full">
          {/* Header */}
          <header className="py-4 px-2 flex justify-between items-center gap-x-2">
            {/* Brand - Hidden when sidebar is minimized */}
            <a
              className={`flex-none font-semibold text-xl text-black dark:text-white focus:outline-hidden focus:opacity-80 ${
                isMinimized ? "hidden" : ""
              }`}
              to="#"
              aria-label="Brand"
            >
              Brand
            </a>

            {/* Close Button for mobile view */}
            <div className="lg:hidden">
              <button
                type="button"
                className="flex justify-center items-center gap-x-3 size-6 bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-gray-100"
                onClick={toggleSidebar}
              >
                <img src={close} alt="" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </header>
          {/* End Header */}

          {/* Body */}
          <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300">
            <div className="pb-0 px-2 w-full flex flex-col flex-wrap">
              <ul className="space-y-1">
                <li>
                  <Link
                    className="min-h-[36px] flex items-center gap-x-3.5 py-2 px-2.5 bg-gray-100 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                    to={buildUrl("/dashboard")}
                  >
                    <img src={dashboard} alt="" />
                    {/* Text is hidden when sidebar is minimized */}
                    <span className={`${isMinimized ? "hidden" : ""}`}>
                      Dashboard
                    </span>
                  </Link>
                </li>

                {/* Products Dropdown */}
                <li>
                  <Link
                    className="min-h-[36px] w-full flex items-center justify-between gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                    onClick={toggleProductsDropdown}
                    aria-expanded={isProductsDropdownOpen}
                    aria-controls="products-dropdown"
                    to={buildUrl("/products")}
                  >
                    <div className="flex items-center gap-x-3.5">
                      <img src={product} alt="" />
                      <span className={`${isMinimized ? "hidden" : ""}`}>
                        Products
                      </span>
                    </div>
                    {!isMinimized && (
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isProductsDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                  {isProductsDropdownOpen && (
                    <ul
                      id="products-dropdown"
                      className={`
                        ps-8 pt-2 space-y-1
                        ${isMinimized ? "hidden" : ""}
                      `}
                    >
                      <li>
                        <Link
                          className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                          to={buildUrl("/products/add")}
                        >
                          <Plus size={16} />
                          Add Product
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                          to={buildUrl("/categories/add")}
                        >
                          <Tag size={16} />
                          Add Category
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                          to={buildUrl("/companies/add")}
                        >
                          <Building2 size={16} />
                          Add Company
                        </Link>
                      </li>
                      {/* <li>
                        <Link
                          className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                          to={`products/product/${id}`}
                        >
                          <Package size={16} />
                          Product Detais
                        </Link>
                      </li> */}
                    </ul>
                  )}
                </li>

                <li>
                  <Link
                    className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                    to={buildUrl("/orders")}
                  >
                    <img src={order} alt="" />
                    <span className={`${isMinimized ? "hidden" : ""}`}>
                      Orders
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 
               text-sm text-gray-800 rounded-lg hover:bg-gray-100 
               focus:outline-hidden focus:bg-gray-100 
               dark:text-white dark:hover:bg-gray-600"
                    to={buildUrl("/orders/confirmed")}
                  >
                    <Package size={16} />{" "}
                    {/* Using Lucide-react Package icon */}
                    <span className={`${isMinimized ? "hidden" : ""}`}>
                      Confirm Orders
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                    to={buildUrl("/customers")}
                  >
                    <img src={customer} alt="" />
                    <span className={`${isMinimized ? "hidden" : ""}`}>
                      Customers
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                    to={buildUrl("/settings")}
                  >
                    <img src={setting} alt="" />
                    <span className={`${isMinimized ? "hidden" : ""}`}>
                      Settings
                    </span>
                  </Link>
                </li>

                {/* <li>
                  <Link
                    className="min-h-[36px] w-full flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-800 rounded-lg hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 dark:text-white dark:hover:bg-gray-600"
                    to="analytics"
                  >
                    <img src={analytics} alt="" />
                    
                    <span
                      className={`text-nowrap ${isMinimized ? "hidden" : ""}`}
                    >
                      Analytics
                    </span>
                  </Link>
                </li> */}
              </ul>
            </div>
          </nav>
          {/* End Body */}
        </div>
      </div>
      {/* End Sidebar */}
    </div>
  );
}

export default Sidebar;
