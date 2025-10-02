import React from 'react';

/**
 * Enhanced Skeleton Loader with more realistic loading animations
 */
const EnhancedSkeletonLoader = ({ 
  type = 'default', 
  count = 1, 
  className = '',
  animate = true
}) => {
  const baseClasses = animate 
    ? 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700' 
    : 'bg-gray-300 dark:bg-gray-600';

  const renderSkeleton = () => {
    switch (type) {
      case 'wishlist-grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }, (_, index) => (
              <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${className}`}>
                <div className={`h-48 ${baseClasses}`}></div>
                <div className="p-4 space-y-3">
                  <div className={`h-4 ${baseClasses} rounded w-3/4`}></div>
                  <div className={`h-4 ${baseClasses} rounded w-1/2`}></div>
                  <div className={`h-6 ${baseClasses} rounded w-2/3`}></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className={`h-8 ${baseClasses} rounded w-16`}></div>
                    <div className={`h-8 ${baseClasses} rounded w-8`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'shop-grid':
        return (
          <div className="space-y-6">
            {/* Toolbar skeleton */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-20 ${baseClasses} rounded`}></div>
                  <div className={`h-6 w-32 ${baseClasses} rounded`}></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-32 ${baseClasses} rounded`}></div>
                  <div className={`h-10 w-20 ${baseClasses} rounded`}></div>
                </div>
              </div>
            </div>
            
            {/* Products grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: count }, (_, index) => (
                <div key={index} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden ${className}`}>
                  <div className={`h-48 ${baseClasses}`}></div>
                  <div className="p-3 space-y-2">
                    <div className={`h-4 ${baseClasses} rounded w-full`}></div>
                    <div className={`h-4 ${baseClasses} rounded w-2/3`}></div>
                    <div className={`h-5 ${baseClasses} rounded w-1/2`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'cart-page':
        return (
          <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
              <div className={`h-8 w-48 ${baseClasses} rounded`}></div>
              <div className={`h-6 w-20 ${baseClasses} rounded`}></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart items skeleton */}
              <div className="lg:col-span-2 space-y-4">
                {Array.from({ length: 3 }, (_, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-20 h-20 ${baseClasses} rounded-lg`}></div>
                      <div className="flex-1 space-y-2">
                        <div className={`h-5 ${baseClasses} rounded w-3/4`}></div>
                        <div className={`h-4 ${baseClasses} rounded w-1/2`}></div>
                        <div className={`h-6 ${baseClasses} rounded w-1/3`}></div>
                      </div>
                      <div className="space-y-2">
                        <div className={`h-10 w-24 ${baseClasses} rounded`}></div>
                        <div className={`h-8 w-8 ${baseClasses} rounded`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Order summary skeleton */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-4">
                  <div className={`h-6 ${baseClasses} rounded w-1/2`}></div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className={`h-4 ${baseClasses} rounded w-1/3`}></div>
                      <div className={`h-4 ${baseClasses} rounded w-1/4`}></div>
                    </div>
                    <div className="flex justify-between">
                      <div className={`h-4 ${baseClasses} rounded w-1/4`}></div>
                      <div className={`h-4 ${baseClasses} rounded w-1/5`}></div>
                    </div>
                  </div>
                  <div className={`h-12 ${baseClasses} rounded w-full`}></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'product-detail-enhanced':
        return (
          <div className="space-y-8">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center space-x-2">
              <div className={`h-4 w-12 ${baseClasses} rounded`}></div>
              <div className={`h-4 w-1 ${baseClasses} rounded`}></div>
              <div className={`h-4 w-16 ${baseClasses} rounded`}></div>
              <div className={`h-4 w-1 ${baseClasses} rounded`}></div>
              <div className={`h-4 w-32 ${baseClasses} rounded`}></div>
            </div>
            
            {/* Main content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image gallery skeleton */}
              <div className="space-y-4">
                <div className={`h-96 ${baseClasses} rounded-lg`}></div>
                <div className="flex space-x-2">
                  {Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className={`w-20 h-20 ${baseClasses} rounded-md`}></div>
                  ))}
                </div>
              </div>
              
              {/* Product info skeleton */}
              <div className="space-y-6">
                <div className={`h-8 ${baseClasses} rounded w-3/4`}></div>
                <div className={`h-6 ${baseClasses} rounded w-1/2`}></div>
                <div className={`h-10 ${baseClasses} rounded w-1/3`}></div>
                <div className={`h-16 ${baseClasses} rounded w-full`}></div>
                <div className="flex gap-4">
                  <div className={`h-12 ${baseClasses} rounded flex-1`}></div>
                  <div className={`h-12 ${baseClasses} rounded flex-1`}></div>
                </div>
                <div className={`h-32 ${baseClasses} rounded w-full`}></div>
              </div>
            </div>
            
            {/* Related products skeleton */}
            <div className="space-y-4">
              <div className={`h-8 ${baseClasses} rounded w-48`}></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden`}>
                    <div className={`h-48 ${baseClasses}`}></div>
                    <div className="p-3 space-y-2">
                      <div className={`h-4 ${baseClasses} rounded w-full`}></div>
                      <div className={`h-5 ${baseClasses} rounded w-1/2`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'empty-state':
        return (
          <div className={`text-center py-16 ${className}`}>
            <div className={`w-24 h-24 mx-auto mb-6 ${baseClasses} rounded-full`}></div>
            <div className={`h-8 ${baseClasses} rounded w-64 mx-auto mb-4`}></div>
            <div className={`h-6 ${baseClasses} rounded w-96 mx-auto mb-8`}></div>
            <div className={`h-12 ${baseClasses} rounded w-40 mx-auto`}></div>
          </div>
        );

      case 'list-item':
        return (
          <div className={`flex items-center space-x-4 p-4 ${className}`}>
            <div className={`w-16 h-16 ${baseClasses} rounded-lg flex-shrink-0`}></div>
            <div className="flex-1 space-y-2">
              <div className={`h-5 ${baseClasses} rounded w-3/4`}></div>
              <div className={`h-4 ${baseClasses} rounded w-1/2`}></div>
            </div>
            <div className={`w-20 h-8 ${baseClasses} rounded`}></div>
          </div>
        );

      default:
        return (
          <div className={`${baseClasses} rounded h-4 w-full ${className}`}></div>
        );
    }
  };

  return renderSkeleton();
};

export default EnhancedSkeletonLoader;
