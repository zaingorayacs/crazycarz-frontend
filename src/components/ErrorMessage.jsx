import React from 'react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

/**
 * Reusable Error Message Component
 * Displays error messages with optional retry functionality
 */
const ErrorMessage = ({ 
  title = "Something went wrong",
  message = "An error occurred while loading data. Please try again.",
  onRetry,
  showRetry = true,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg text-center border border-red-200 dark:border-red-800 ${className}`}>
      <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
        <FaExclamationTriangle className="text-red-500 dark:text-red-400 text-4xl" />
      </div>
      <h2 className="text-2xl font-semibold mb-4 text-red-600 dark:text-red-400">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {message}
      </p>
      {showRetry && onRetry && (
        <button 
          onClick={onRetry}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <FaRedo size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
