import React from 'react';

const SkeletonLoader = ({ 
  type = 'default', 
  count = 1, 
  className = '',
  width = 'w-full',
  height = 'h-4'
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'carousel':
        return (
          <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}>
            <div className="aspect-[16/9] bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            <div className="p-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            </div>
          </div>
        );

      case 'category':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden ${className}`}>
            <div className="aspect-square bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-4">
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
            </div>
          </div>
        );

      case 'product':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden relative ${className}`}>
            <div className="h-48 bg-gray-300 dark:bg-gray-600"></div>
            <div className="p-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </div>
        );

      case 'cart-item':
        return (
          <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${className}`}>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2 w-3/4"></div>
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
              </div>
            </div>
          </div>
        );

      case 'product-detail':
        return (
          <div className={`animate-pulse ${className}`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-96 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                <div className="flex space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                <div className="h-24 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`animate-pulse bg-gray-300 dark:bg-gray-600 rounded ${width} ${height} ${className}`}></div>
        );

      default:
        return (
          <div className={`animate-pulse bg-gray-300 dark:bg-gray-600 rounded ${width} ${height} ${className}`}></div>
        );
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;