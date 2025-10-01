import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { FaFilter, FaSort, FaTh, FaList, FaSearch, FaTimes } from 'react-icons/fa';
import { useProducts, useCategories, useCompanies } from '../hooks/useApi';

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  
  // Fetch data using hooks
  const { data: productsData, loading: productsLoading, error: productsError } = useProducts();
  const { data: categoriesData, loading: categoriesLoading } = useCategories();
  const { data: companiesData, loading: companiesLoading } = useCompanies();
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // UI States
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState('featured');
  
  // Extract data
  const products = productsData?.message || productsData?.data || [];
  const categories = categoriesData?.data || [];
  const companies = companiesData?.data || [];
  const loading = productsLoading || categoriesLoading || companiesLoading;
  const error = productsError;

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
    }
  }, [products, searchParams]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p?.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
  }, [products, searchQuery, selectedCategory, selectedCompany, priceRange, sortBy]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCompany('all');
    setPriceRange([0, 10000]);
    setSortBy('featured');
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <div className="h-12 w-64 bg-gray-300 dark:bg-gray-700 rounded mb-8 animate-pulse"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }, (_, i) => (
                <SkeletonLoader key={i} type="product" />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <ErrorMessage
              title="Error Loading Shop"
              message={error}
              onRetry={() => window.location.reload()}
            />
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
              
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {filteredProducts.length}
                </span>{' '}
                {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
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
          {filteredProducts.length === 0 ? (
            <EmptyState
              icon={FaSearch}
              title="No products found"
              message="Try adjusting your filters or search query"
              actionText="Clear Filters"
              actionOnClick={clearFilters}
            />
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'flex flex-col gap-4'
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product?._id || product?.id}
                  product={product}
                  viewMode={viewMode}
                  hideActions={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ShopPage;
