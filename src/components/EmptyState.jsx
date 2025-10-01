import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable Empty State Component
 * Displays empty state messages with optional action button
 */
const EmptyState = ({ 
  icon: Icon,
  title = "No items found",
  message = "There are no items to display.",
  actionText,
  actionLink,
  onAction,
  className = ""
}) => {
  return (
    <div className={`bg-white dark:bg-gray-800 p-12 rounded-xl shadow-lg text-center border border-gray-200 dark:border-gray-700 ${className}`}>
      {Icon && (
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <Icon className="text-gray-400 dark:text-gray-500 text-4xl" />
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        {message}
      </p>
      {(actionText && (actionLink || onAction)) && (
        actionLink ? (
          <Link 
            to={actionLink}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {actionText}
          </Link>
        ) : (
          <button 
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {actionText}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
