import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import products from '../data/products';
import { FaArrowLeft, FaFilter, FaSort } from 'react-icons/fa';
import { useProductsByCategory, useProductsByCompany } from '../hooks/useProductData';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const CategoryPage = () => {
  const { category } = useParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [useApiData, setUseApiData] = useState(true);

  // Category display names
  const categoryNames = {
    sports: 'Sports Cars',
    luxury: 'Luxury Vehicles',
    electric: 'Electric Vehicles',
    compact: 'Compact Cars',
    trucks: 'Trucks & Pickups',
    hybrid: 'Hybrid Vehicles',
    family: 'Family Vehicles'
  };

  // Company display names
  const companyNames = {
    tesla: 'Tesla',
    bmw: 'BMW',
    mercedes: 'Mercedes',
    toyota: 'Toyota',
    honda: 'Honda',
    ford: 'Ford',
    audi: 'Audi',
    porsche: 'Porsche'
  };

  // Determine if it's a category or company
  const isCategory = !!categoryNames[category];
  const isCompany = !!companyNames[category];
  
  // Fetch from API based on type
  const { 
    products: apiCategoryProducts, 
    loading: categoryLoading, 
    error: categoryError,
    refetch: refetchCategory 
  } = useProductsByCategory(isCategory ? category : null);
  
  const { 
    products: apiCompanyProducts, 
    loading: companyLoading, 
    error: companyError,
    refetch: refetchCompany 
  } = useProductsByCompany(isCompany ? category : null);
  
  // Determine which data to use
  const apiProducts = isCategory ? apiCategoryProducts : isCompany ? apiCompanyProducts : [];
  const loading = isCategory ? categoryLoading : isCompany ? companyLoading : false;
  const error = isCategory ? categoryError : isCompany ? companyError : null;
  const refetch = isCategory ? refetchCategory : refetchCompany;
  
  // Fallback to static data if API fails
  useEffect(() => {
    if (error && useApiData) {
      console.warn('API failed, falling back to static data');
      setUseApiData(false);
    }
  }, [error, useApiData]);
  
  // Filter and sort products
  useEffect(() => {
    let productsToUse = [];
    
    // Use API data if available and no error, otherwise use static data
    if (useApiData && !error && apiProducts?.length > 0) {
      productsToUse = apiProducts;
    } else {
      // Filter static products by category or company
      productsToUse = products.filter(product => {
        if (categoryNames[category]) {
          return product.category === category;
        } else if (companyNames[category]) {
          return product.company === category;
        }
        return false;
      });
    }
    
    // Sort products
    const sorted = [...productsToUse].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a?.name || a?.title || '').localeCompare(b?.name || b?.title || '');
        case 'price-low':
          return (a?.price || a?.currentPrice || 0) - (b?.price || b?.currentPrice || 0);
        case 'price-high':
          return (b?.price || b?.currentPrice || 0) - (a?.price || a?.currentPrice || 0);
        case 'rating':
          return (b?.rating || 0) - (a?.rating || 0);
        default:
          return 0;
      }
    });
    
    setFilteredProducts(sorted);
  }, [category, sortBy, apiProducts, error, useApiData]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 py-8">
          <div className="container mx-auto px-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6 animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <SkeletonLoader key={i} type="product" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <span>/</span>
            <span className="text-gray-900 dark:text-gray-100">{categoryNames[category] || companyNames[category] || category}</span>
          </nav>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {categoryNames[category] || companyNames[category] || category}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'vehicle' : 'vehicles'} found
              </p>
            </div>
            
            {/* Back Button */}
            <Link 
              to="/" 
              className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mt-4 md:mt-0"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Filters and Sort */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Browse Other Categories & Companies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Categories */}
              {Object.entries(categoryNames).map(([key, name]) => (
                <Link
                  key={key}
                  to={`/products/${key}`}
                  className={`p-4 rounded-lg text-center transition-colors ${
                    category === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{name}</div>
                </Link>
              ))}
              {/* Companies */}
              {Object.entries(companyNames).map(([key, name]) => (
                <Link
                  key={key}
                  to={`/products/${key}`}
                  className={`p-4 rounded-lg text-center transition-colors ${
                    category === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="text-sm font-medium">{name}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Error State */}
          {error && useApiData && (
            <div className="mb-6">
              <ErrorMessage
                title="Error Loading Products"
                message={error || "Failed to load products. Showing cached data instead."}
                onRetry={refetch}
                showRetry={false}
              />
            </div>
          )}

          {/* Products Grid */}
          {filteredProducts?.length === 0 ? (
            <EmptyState
              icon={() => (
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                </svg>
              )}
              title="No vehicles found"
              message="We couldn't find any vehicles in this category. Try browsing other categories or check back later."
              actionText="Browse All Categories"
              actionLink="/"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => {
                if (!product) return null;
                return (
                  <ProductCard 
                    key={product?._id || product?.id || Math.random()} 
                    product={product} 
                    hideActions={true} 
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CategoryPage;
