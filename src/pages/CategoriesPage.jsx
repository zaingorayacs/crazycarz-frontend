import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCategories } from '../hooks/useApi';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { FaArrowLeft, FaBox } from 'react-icons/fa';

const CategoriesPage = () => {
  const { data: categoriesData, loading, error, refetch } = useCategories();
  const categories = categoriesData?.data || [];

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              All Categories
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Browse all available product categories
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 12 }, (_, index) => (
                <SkeletonLoader key={index} type="category" />
              ))}
            </div>
          ) : error ? (
            <ErrorMessage
              title="Error Loading Categories"
              message={error}
              onRetry={refetch}
            />
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <FaBox className="text-gray-400 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Categories Available
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Check back later for new categories.
              </p>
            </div>
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {categories.map((category) => (
                  <Link 
                    key={category._id} 
                    to={`/products/${category.name}`}
                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="aspect-square relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
                      <img 
                        src={category.image || "https://picsum.photos/200/200?random=category"} 
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://picsum.photos/200/200?random=fallback";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 text-center">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{categories.length}</span> categories available
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;
