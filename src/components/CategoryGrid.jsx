import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SkeletonLoader from './SkeletonLoader';

const CategoryGrid = ({ categories, title = "Categories", isCompany = false, isLoading = false }) => {
  
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 py-8">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {Array.from({ length: 8 }, (_, index) => (
              <SkeletonLoader key={index} type="category" />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (!categories || categories.length === 0) {
    return null;
  }
  
  // Show different number of items based on screen size
  // Mobile: 4, Tablet: 8, Desktop: 12, Large: 16
  const getDisplayLimit = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 640) return 4;  // Mobile
      if (width < 768) return 6;  // Small tablet
      if (width < 1024) return 8; // Tablet
      if (width < 1280) return 12; // Desktop
      return 16; // Large desktop
    }
    return 8; // Default
  };
  
  const displayLimit = getDisplayLimit();
  const displayCategories = categories.slice(0, displayLimit);
  const hasMore = categories.length > displayLimit;
  const viewAllLink = isCompany ? '/companies' : '/categories';

  return (
    <div className="bg-white dark:bg-gray-900 py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-left text-gray-900 dark:text-gray-100">{title}</h2>
          {hasMore && (
            <Link 
              to={viewAllLink}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {displayCategories.map((category) => {
            // For companies, make them clickable and route to /products/{company_name}
            if (isCompany) {
              return (
                <Link 
                  key={category._id} 
                  to={`/products/${category.name}`}
                  className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer block"
                >
                  <div className="aspect-square relative">
                    <img 
                      src={category.logo || "https://picsum.photos/150/150?random=company"} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://picsum.photos/150/150?random=fallback";
                      }}
                    />
                  </div>
                  <div className="p-2 text-center">
                    <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              );
            }
            
            // For categories, use the normal Link behavior
            return (
              <Link 
                key={category._id} 
                to={`/products/${category.name}`}
                className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer block"
              >
                <div className="aspect-square relative">
                  <img 
                    src="https://picsum.photos/150/150?random=category" 
                    alt={category.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://picsum.photos/150/150?random=fallback";
                    }}
                  />
                </div>
                <div className="p-2 text-center">
                  <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                    {category.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
        
        {/* Show More Button at Bottom */}
        {hasMore && (
          <div className="mt-8 text-center">
            <Link 
              to={viewAllLink}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-all hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <span>View All {title}</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Showing {displayCategories.length} of {categories.length} {isCompany ? 'companies' : 'categories'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryGrid;