import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaRegHeart, 
  FaShoppingCart, 
  FaSearch, 
  FaBoxOpen, 
  FaExclamationCircle,
  FaPlus,
  FaArrowLeft
} from 'react-icons/fa';

/**
 * Enhanced Empty State Component with contextual messaging and actions
 */
const EnhancedEmptyState = ({
  type = 'default',
  title,
  message,
  actionText,
  actionLink,
  actionOnClick,
  secondaryActionText,
  secondaryActionLink,
  secondaryActionOnClick,
  className = '',
  showAnimation = true
}) => {
  // Predefined empty state configurations
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'wishlist':
        return {
          icon: FaRegHeart,
          title: title || 'Your wishlist is empty',
          message: message || 'Save items you love to your wishlist. Review them anytime and easily move them to your cart.',
          actionText: actionText || 'Browse Products',
          actionLink: actionLink || '/shop',
          secondaryActionText: secondaryActionText || 'View Categories',
          secondaryActionLink: secondaryActionLink || '/categories',
          iconColor: 'text-pink-500 dark:text-pink-400',
          bgColor: 'bg-pink-100 dark:bg-pink-900/30'
        };

      case 'cart':
        return {
          icon: FaShoppingCart,
          title: title || 'Your cart is empty',
          message: message || 'Looks like you haven\'t added any products to your cart yet. Start shopping to fill it up!',
          actionText: actionText || 'Start Shopping',
          actionLink: actionLink || '/shop',
          secondaryActionText: secondaryActionText || 'View Wishlist',
          secondaryActionLink: secondaryActionLink || '/wishlist',
          iconColor: 'text-blue-500 dark:text-blue-400',
          bgColor: 'bg-blue-100 dark:bg-blue-900/30'
        };

      case 'search':
        return {
          icon: FaSearch,
          title: title || 'No products found',
          message: message || 'We couldn\'t find any products matching your search criteria. Try adjusting your filters or search terms.',
          actionText: actionText || 'Clear Filters',
          actionOnClick: actionOnClick,
          secondaryActionText: secondaryActionText || 'Browse All Products',
          secondaryActionLink: secondaryActionLink || '/shop',
          iconColor: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800'
        };

      case 'products':
        return {
          icon: FaBoxOpen,
          title: title || 'No products available',
          message: message || 'There are currently no products in this category. Check back later or browse other categories.',
          actionText: actionText || 'Browse Categories',
          actionLink: actionLink || '/categories',
          secondaryActionText: secondaryActionText || 'Go Home',
          secondaryActionLink: secondaryActionLink || '/',
          iconColor: 'text-orange-500 dark:text-orange-400',
          bgColor: 'bg-orange-100 dark:bg-orange-900/30'
        };

      case 'error':
        return {
          icon: FaExclamationCircle,
          title: title || 'Something went wrong',
          message: message || 'We encountered an error while loading your data. Please try again or contact support if the problem persists.',
          actionText: actionText || 'Try Again',
          actionOnClick: actionOnClick,
          secondaryActionText: secondaryActionText || 'Go Back',
          secondaryActionOnClick: secondaryActionOnClick || (() => window.history.back()),
          iconColor: 'text-red-500 dark:text-red-400',
          bgColor: 'bg-red-100 dark:bg-red-900/30'
        };

      case 'orders':
        return {
          icon: FaBoxOpen,
          title: title || 'No orders yet',
          message: message || 'You haven\'t placed any orders yet. Start shopping to see your order history here.',
          actionText: actionText || 'Start Shopping',
          actionLink: actionLink || '/shop',
          secondaryActionText: secondaryActionText || 'View Wishlist',
          secondaryActionLink: secondaryActionLink || '/wishlist',
          iconColor: 'text-green-500 dark:text-green-400',
          bgColor: 'bg-green-100 dark:bg-green-900/30'
        };

      default:
        return {
          icon: FaBoxOpen,
          title: title || 'Nothing here yet',
          message: message || 'This section is empty. Check back later for updates.',
          actionText: actionText || 'Go Back',
          actionOnClick: actionOnClick || (() => window.history.back()),
          iconColor: 'text-gray-500 dark:text-gray-400',
          bgColor: 'bg-gray-100 dark:bg-gray-800'
        };
    }
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <div className={`text-center py-16 px-4 ${className}`}>
      <div className={`w-24 h-24 mx-auto mb-6 ${config.bgColor} rounded-full flex items-center justify-center ${showAnimation ? 'animate-pulse' : ''}`}>
        <IconComponent className={`text-4xl ${config.iconColor}`} />
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        {config.title}
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
        {config.message}
      </p>
      
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {/* Primary Action */}
        {(config.actionText && (config.actionLink || config.actionOnClick)) && (
          <>
            {config.actionLink ? (
              <Link
                to={config.actionLink}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                <FaPlus className="mr-2" size={14} />
                {config.actionText}
              </Link>
            ) : (
              <button
                onClick={config.actionOnClick}
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
              >
                {config.actionText}
              </button>
            )}
          </>
        )}
        
        {/* Secondary Action */}
        {(config.secondaryActionText && (config.secondaryActionLink || config.secondaryActionOnClick)) && (
          <>
            {config.secondaryActionLink ? (
              <Link
                to={config.secondaryActionLink}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
              >
                <FaArrowLeft className="mr-2" size={14} />
                {config.secondaryActionText}
              </Link>
            ) : (
              <button
                onClick={config.secondaryActionOnClick}
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 font-medium rounded-lg transition-colors"
              >
                <FaArrowLeft className="mr-2" size={14} />
                {config.secondaryActionText}
              </button>
            )}
          </>
        )}
      </div>
      
      {/* Optional decorative elements */}
      {showAnimation && (
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      )}
    </div>
  );
};

export default EnhancedEmptyState;
