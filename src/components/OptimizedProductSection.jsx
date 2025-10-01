import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import SkeletonLoader from './SkeletonLoader';
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaSpinner } from 'react-icons/fa';

/**
 * Optimized Product Section Component
 * Features: Horizontal scroll, infinite scroll, lazy loading, randomization
 */
const OptimizedProductSection = ({ 
  title = "Products",
  fetchFunction, // Function to fetch products
  limit = 8,
  randomize = false,
  showViewAll = true,
  viewAllLink = "/shop",
  filterFn = null, // Optional filter function (e.g., for sale items)
  className = "",
  enableInfiniteScroll = true // Enable infinite scroll
}) => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const observerRef = useRef(null);
  const loadMoreTriggerRef = useRef(null);

  // Fetch all products on mount
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await fetchFunction();
        // Handle different response formats
        let productList = Array.isArray(data) ? data : (data?.message || data?.data || []);
        
        console.log(`${title} - Raw data:`, data);
        console.log(`${title} - Product list:`, productList);
        
        // Apply filter if provided
        if (filterFn && typeof filterFn === 'function') {
          productList = productList.filter(filterFn);
        }
        
        // Randomize if needed
        if (randomize && productList.length > 0) {
          productList = shuffleArray([...productList]);
        }
        
        console.log(`${title} - Final product count:`, productList.length);
        
        setProducts(productList);
        
        // Show initial batch
        const initialBatch = productList.slice(0, limit);
        console.log(`${title} - Initial batch:`, initialBatch.length);
        setDisplayedProducts(initialBatch);
        setCurrentIndex(limit);
        setHasMore(productList.length > limit);
      } catch (err) {
        console.error(`${title} - Error loading products:`, err);
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    if (fetchFunction) {
      loadProducts();
    }
  }, [fetchFunction, limit, randomize, filterFn, title]);

  // Load more products
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    
    setTimeout(() => {
      const nextBatch = products.slice(currentIndex, currentIndex + limit);
      
      if (nextBatch.length > 0) {
        setDisplayedProducts(prev => [...prev, ...nextBatch]);
        setCurrentIndex(prev => prev + limit);
        setHasMore(currentIndex + limit < products.length);
      } else {
        setHasMore(false);
      }
      
      setLoadingMore(false);
    }, 500); // Simulate loading delay
  }, [products, currentIndex, limit, loadingMore, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll || !loadMoreTriggerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(loadMoreTriggerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enableInfiniteScroll, hasMore, loadingMore, loadMore]);

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [products]);

  // Scroll functions
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Shuffle array utility
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  if (loading) {
    return (
      <div className={`bg-white dark:bg-gray-900 py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-6 animate-pulse"></div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex-shrink-0 w-64">
                <SkeletonLoader type="product" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-900 py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  // Don't render section if no products after loading
  if (!loading && (!displayedProducts || displayedProducts.length === 0)) {
    console.log(`${title}: No products to display`);
    return null;
  }

  return (
    <div className={`bg-white dark:bg-gray-900 py-8 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          {showViewAll && (
            <Link 
              to={viewAllLink}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-2 transition-colors group"
            >
              View All
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>

        {/* Scrollable Product Container */}
        <div className="relative">
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-gray-700 dark:text-gray-300" />
            </button>
          )}

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-gray-700 dark:text-gray-300" />
            </button>
          )}

          {/* Products Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {displayedProducts.map((product) => (
              <div key={product?._id || product?.id} className="flex-shrink-0 w-64">
                <ProductCard product={product} hideActions={true} />
              </div>
            ))}
            
            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex-shrink-0 w-64 flex items-center justify-center">
                <FaSpinner className="animate-spin text-blue-600 text-3xl" />
              </div>
            )}
            
            {/* Infinite Scroll Trigger */}
            {enableInfiniteScroll && hasMore && (
              <div ref={loadMoreTriggerRef} className="flex-shrink-0 w-4" />
            )}
          </div>
        </div>

        {/* Product Count */}
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {displayedProducts.length} of {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
          
          {/* Manual Load More Button (fallback) */}
          {!enableInfiniteScroll && hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  Load More
                  <FaArrowRight />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimizedProductSection;
