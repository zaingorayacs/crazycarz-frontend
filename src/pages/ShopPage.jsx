import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import EnhancedSkeletonLoader from '../components/EnhancedSkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import { FaFilter, FaSort, FaTh, FaList, FaSearch, FaTimes, FaSyncAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useEnhancedProducts, useEnhancedCategories, useEnhancedCompanies } from '../hooks/useEnhancedApi';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  
  // Temporary direct API call to bypass Enhanced API issues
  const [productsData, setProductsData] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('🔍 Direct API call - Starting...');
        setProductsLoading(true);
        setProductsError(null);
        
        const result = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/products`);
        const data = await result.json();
        
        console.log('🔍 Direct API call - Success:', data);
        setProductsData(data);
        setProductsLoading(false);
      } catch (error) {
        console.error('🔍 Direct API call - Error:', error);
        setProductsError(error.message);
        setProductsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const refetchProducts = () => {
    // Placeholder for now
  };
  const productsRetryAttempt = 0;
  const productsRetrying = false;
  
  const { 
    data: categoriesData, 
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories
  } = useEnhancedCategories();
  
  const { 
    data: companiesData, 
    loading: companiesLoading,
    error: companiesError,
    refetch: refetchCompanies
  } = useEnhancedCompanies();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // UI States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  
  // Extract data with safe handling
  const products = useMemo(() => {
    console.log('ShopPage - Raw productsData:', productsData);
    
    // The API returns: {statusCode: 200, data: Array, message: string, success: true}
    // But sometimes we might get cached data with different structure
    let extractedProducts = [];
    
    if (productsData?.data && Array.isArray(productsData.data)) {
      extractedProducts = productsData.data;
    } else if (productsData?.message && Array.isArray(productsData.message)) {
      extractedProducts = productsData.message;
    } else if (Array.isArray(productsData)) {
      extractedProducts = productsData;
    }
    
    console.log('ShopPage - Extracted products:', extractedProducts?.length || 0, 'products');
    return extractedProducts;
  }, [productsData]);
  
  const categories = useMemo(() => {
    return categoriesData?.data || [];
  }, [categoriesData]);
  
  const companies = useMemo(() => {
    return companiesData?.data || [];
  }, [companiesData]);
  
  // Only block on products loading - categories and companies are optional filters
  const loading = productsLoading;
  const hasError = productsError;
  const primaryError = productsError; // Products are most critical
  
  // Track filter loading separately
  const filtersLoading = categoriesLoading || companiesLoading;
  const filtersError = categoriesError || companiesError;

  // Handle manual refresh of all data
  const handleRefreshAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchProducts(),
        refetchCategories(),
        refetchCompanies()
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchProducts, refetchCategories, refetchCompanies]);
  
  // Initialize filtered products and handle URL filters
  useEffect(() => {
    if (products.length > 0) {
      const filter = searchParams.get('filter');
      const search = searchParams.get('search');
      
      let filtered = [...products];
      
      // Apply search filter from URL
      if (search) {
        setSearchQuery(search);
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(p =>
          (p?.title || p?.name || '').toLowerCase().includes(searchLower) ||
          (p?.shortDescription || p?.description || '').toLowerCase().includes(searchLower)
        );
      }
      
      // Apply sale filter
      if (filter === 'sale') {
        filtered = filtered.filter(p => 
          p?.salePrice && p?.currentPrice && p.salePrice < p.currentPrice
        );
      }
      
      setFilteredProducts(filtered);
    } else if (!loading && !hasError) {
      // No products available
      setFilteredProducts([]);
    }
  }, [products, searchParams, loading, hasError]);

  // Apply filters with memoization for performance
  const applyFilters = useCallback(() => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }
    
    let filtered = [...products];

    try {
      // Search filter
      if (searchQuery?.trim()) {
        const searchLower = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => {
          const title = (p?.title || p?.name || '').toLowerCase();
          const description = (p?.shortDescription || p?.description || '').toLowerCase();
          const category = typeof p?.category === 'object' ? p?.category?.name?.toLowerCase() : (p?.category || '').toLowerCase();
          const company = typeof p?.company === 'object' ? p?.company?.name?.toLowerCase() : (p?.company || '').toLowerCase();
          
          return title.includes(searchLower) || 
                 description.includes(searchLower) ||
                 category.includes(searchLower) ||
                 company.includes(searchLower);
        });
      }

      // Category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => {
          const category = typeof p?.category === 'object' ? p?.category?.name : p?.category;
          return category === selectedCategory;
        });
      }

      // Company filter
      if (selectedCompany !== 'all') {
        filtered = filtered.filter(p => {
          const company = typeof p?.company === 'object' ? p?.company?.name : p?.company;
          return company === selectedCompany;
        });
      }

      // Price range filter
      filtered = filtered.filter(p => {
        const price = p?.salePrice || p?.currentPrice || p?.price || 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });

      // Sort
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => {
            const priceA = a?.salePrice || a?.currentPrice || a?.price || 0;
            const priceB = b?.salePrice || b?.currentPrice || b?.price || 0;
            return priceA - priceB;
          });
          break;
        case 'price-high':
          filtered.sort((a, b) => {
            const priceA = a?.salePrice || a?.currentPrice || a?.price || 0;
            const priceB = b?.salePrice || b?.currentPrice || b?.price || 0;
            return priceB - priceA;
          });
          break;
        case 'rating':
          filtered.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
          break;
        case 'name':
          filtered.sort((a, b) => {
            const nameA = a?.title || a?.name || '';
            const nameB = b?.title || b?.name || '';
            return nameA.localeCompare(nameB);
          });
          break;
        default:
          // Featured - keep original order
          break;
      }

      setFilteredProducts(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
      setFilteredProducts([]);
    }
  }, [products, searchQuery, selectedCategory, selectedCompany, priceRange, sortBy]);
  
  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCompany('all');
    setPriceRange([0, 10000]);
    setSortBy('featured');
  };

  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <EnhancedSkeletonLoader 
              type="shop-grid" 
              count={8}
            />
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (hasError && !products.length) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <ErrorMessage
              title="Unable to Load Shop"
              message={`${primaryError}${productsRetrying ? ' Retrying...' : ''}`}
              onRetry={handleRefreshAll}
              showRetry={!productsRetrying}
            />
            
            {/* Show partial error state if some data loaded */}
            {(categoriesError || companiesError) && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-orange-500 mr-2" />
                  <p className="text-orange-700 dark:text-orange-300 text-sm">
                    Some filters may not be available due to loading errors.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Shop All Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Discover our complete collection of premium auto parts
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            {/* Left side - Filters & Results */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <FaFilter />
                Filters
              </button>
              
              <div className="flex items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {filteredProducts.length}
                  </span>{' '}
                  {filteredProducts.length === 1 ? 'product' : 'products'} found
                  {products.length > 0 && filteredProducts.length !== products.length && (
                    <span className="text-sm ml-1">of {products.length} total</span>
                  )}
                </p>
                
                {/* Refresh button */}
                <button
                  onClick={handleRefreshAll}
                  disabled={isRefreshing || loading}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh products"
                >
                  <FaSyncAlt className={`${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                
                {/* Retry indicator */}
                {productsRetryAttempt > 0 && (
                  <span className="text-xs text-orange-500 dark:text-orange-400">
                    Retrying... ({productsRetryAttempt})
                  </span>
                )}
              </div>
            </div>

            {/* Right side - Sort & View */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A-Z</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FaTh />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <FaList />
                </button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mb-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Filters
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Company Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company
                  </label>
                  <select
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="all">All Companies</option>
                    {companies.map((comp) => (
                      <option key={comp._id} value={comp.name}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          {!products.length && !loading ? (
            <EnhancedEmptyState
              type="products"
              title="No products available"
              message="We're currently updating our inventory. Please check back later or browse our categories."
            />
          ) : filteredProducts.length === 0 ? (
            <EnhancedEmptyState
              type="search"
              title="No products found"
              message="We couldn't find any products matching your current filters. Try adjusting your search criteria."
              actionText="Clear Filters"
              actionOnClick={clearFilters}
              secondaryActionText="Browse All Products"
              secondaryActionOnClick={() => {
                clearFilters();
                setSearchQuery('');
              }}
            />
          ) : (
            <>
              {/* Error banner for partial failures */}
              {(categoriesError || companiesError) && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center">
                    <FaExclamationTriangle className="text-yellow-500 mr-2" />
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Some filters may be limited due to loading issues. Products are still available.
                    </p>
                  </div>
                </div>
              )}
              
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                    : 'flex flex-col gap-4'
                }
              >
                {filteredProducts.map((product) => {
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;