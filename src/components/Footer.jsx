import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-gray-300 dark:text-gray-400 py-8 border-t border-gray-700 dark:border-gray-600">
      <div className="container mx-auto px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 text-sm text-center sm:text-left">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white dark:text-gray-100 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/about"
                  className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="/faqs"
                  className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Connect with Us (centered) */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold text-white dark:text-gray-100 mb-3">
              Connect with Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                aria-label="Facebook"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
              >
                <FaTwitter size={20} />
              </a>
              <a
                href="https://instagram.com"
                aria-label="Instagram"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="LinkedIn"
                className="text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-gray-200 transition-colors duration-200"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 dark:border-gray-600 pt-6 mt-4 flex justify-center items-center text-xs">
          <p className="text-center">
            &copy; {new Date().getFullYear()} CrazyCars. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
