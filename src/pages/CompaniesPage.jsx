import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useCompanies } from '../hooks/useApi';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { FaArrowLeft, FaBuilding } from 'react-icons/fa';

const CompaniesPage = () => {
  const { data: companiesData, loading, error, refetch } = useCompanies();
  const companies = companiesData?.data || [];

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
              All Companies
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Explore products from top automotive brands
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
              title="Error Loading Companies"
              message={error}
              onRetry={refetch}
            />
          ) : companies.length === 0 ? (
            <div className="text-center py-16">
              <FaBuilding className="text-gray-400 text-6xl mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Companies Available
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Check back later for new brands.
              </p>
            </div>
          ) : (
            <>
              {/* Companies Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {companies.map((company) => (
                  <Link 
                    key={company._id} 
                    to={`/products/${company.name}`}
                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-700"
                  >
                    <div className="aspect-square relative bg-white dark:bg-gray-700 p-4 flex items-center justify-center">
                      <img 
                        src={company.logo || "https://picsum.photos/200/200?random=company"} 
                        alt={company.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://picsum.photos/200/200?random=fallback";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-4 text-center bg-gray-50 dark:bg-gray-700/50">
                      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {company.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Total: <span className="font-semibold text-gray-900 dark:text-gray-100">{companies.length}</span> brands available
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CompaniesPage;
