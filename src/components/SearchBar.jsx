import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaSpinner, FaClock, FaChartLine } from 'react-icons/fa';
import apiService from '../services/api';

const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches] = useState(['LED Headlights', 'Car Rims', 'Floor Mats', 'Fog Lights']);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search function with debounce
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    try {
      // Try using search API endpoint first
      let products = [];
      
      try {
        const searchResponse = await apiService.searchProducts(searchQuery);
        products = searchResponse?.data || [];
        console.log('Search API response:', products.length, 'results');
      } catch (apiError) {
        console.log('Search API not available, falling back to client-side search');
        
        // Fallback: Get all products and filter client-side
        const response = await apiService.getAllProducts();
        const allProducts = response?.data || [];
        
        // Filter products based on search query
        products = allProducts.filter(product => {
          const searchLower = searchQuery.toLowerCase();
          const title = (product?.title || product?.name || '').toLowerCase();
          const description = (product?.shortDescription || product?.description || '').toLowerCase();
          const category = typeof product?.category === 'object' 
            ? product?.category?.name?.toLowerCase() 
            : (product?.category || '').toLowerCase();
          const company = typeof product?.company === 'object'
            ? product?.company?.name?.toLowerCase()
            : (product?.company || '').toLowerCase();
          const tags = product?.tags?.join(' ').toLowerCase() || '';
          
          return title.includes(searchLower) || 
                 description.includes(searchLower) ||
                 category.includes(searchLower) ||
                 company.includes(searchLower) ||
                 tags.includes(searchLower);
        });
      }

      // Limit to top 8 results
      setResults(products.slice(0, 8));
      console.log('Search results:', products.length);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(true);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms debounce
  };

  // Save to recent searches
  const saveRecentSearch = (searchTerm) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Handle product click
  const handleProductClick = (product) => {
    const productId = product?._id || product?.id;
    saveRecentSearch(query);
    setShowResults(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  // Handle search submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      setShowResults(false);
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  // Handle quick search click
  const handleQuickSearch = (searchTerm) => {
    setQuery(searchTerm);
    performSearch(searchTerm);
    inputRef.current?.focus();
  };

  // Clear search
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  // Format price
  const formatPrice = (product) => {
    const price = product?.salePrice || product?.currentPrice || product?.price || 0;
    return `$${price.toFixed(2)}`;
  };

  // Get product image
  const getProductImage = (product) => {
    return product?.images?.[0] || product?.image || 'https://via.placeholder.com/60x60?text=No+Image';
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Search Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowResults(true)}
            placeholder="Search products, categories, brands..."
            className="w-full pl-12 pr-12 py-3 rounded-full border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FaTimes />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-h-[500px] overflow-y-auto z-50">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <FaSpinner className="animate-spin text-blue-600 text-2xl mr-3" />
              <span className="text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          )}

          {/* No Query - Show Recent & Trending */}
          {!query && !loading && (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <FaClock className="text-gray-400" />
                    Recent Searches
                  </div>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickSearch(search)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <FaChartLine className="text-blue-500" />
                  Trending Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickSearch(search)}
                      className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && !loading && results.length > 0 && (
            <div>
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Found <span className="font-semibold text-gray-900 dark:text-gray-100">{results.length}</span> results
                </p>
              </div>
              <div className="p-2">
                {results.map((product) => (
                  <button
                    key={product?._id || product?.id}
                    onClick={() => handleProductClick(product)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                  >
                    {/* Product Image */}
                    <img
                      src={getProductImage(product)}
                      alt={product?.title || product?.name}
                      className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/60x60?text=No+Image';
                      }}
                    />
                    
                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {product?.title || product?.name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {typeof product?.category === 'object' 
                          ? product?.category?.name 
                          : product?.category || 'Uncategorized'}
                      </p>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formatPrice(product)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* View All Results */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => {
                    navigate(`/shop?search=${encodeURIComponent(query)}`);
                    setShowResults(false);
                  }}
                  className="w-full py-2 text-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          )}

          {/* No Results */}
          {query && !loading && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                No results found for "<span className="font-semibold">{query}</span>"
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Try different keywords or browse our categories
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
