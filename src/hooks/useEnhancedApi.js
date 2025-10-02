import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import apiService from '../services/api';

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Enhanced API hook with caching, retry logic, and better error handling
 */
export const useEnhancedApi = (
  apiCall, 
  dependencies = [], 
  options = {}
) => {
  const {
    enableCache = true,
    cacheKey = null,
    retryCount = 3,
    retryDelay = 1000,
    initialData = null,
    onSuccess = null,
    onError = null,
    enabled = true
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [retryAttempt, setRetryAttempt] = useState(0);
  
  const abortControllerRef = useRef();
  const mountedRef = useRef(true);

  // Generate cache key from dependencies if not provided
  const getCacheKey = useCallback(() => {
    if (cacheKey) return cacheKey;
    return `api_${JSON.stringify(dependencies)}`;
  }, [cacheKey, dependencies]);

  // Check cache for existing data
  const getCachedData = useCallback(() => {
    if (!enableCache) return null;
    
    const key = getCacheKey();
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    
    return null;
  }, [enableCache, getCacheKey]);

  // Set cache data
  const setCachedData = useCallback((newData) => {
    if (!enableCache) return;
    
    const key = getCacheKey();
    cache.set(key, {
      data: newData,
      timestamp: Date.now()
    });
  }, [enableCache, getCacheKey]);

  // Fetch data with retry logic
  const fetchData = useCallback(async (attempt = 0) => {
    if (!enabled || !mountedRef.current) return;

    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);
      setRetryAttempt(attempt);

      // Check cache first
      const cachedData = getCachedData();
      if (cachedData && attempt === 0) {
        setData(cachedData);
        setLoading(false);
        onSuccess?.(cachedData);
        return cachedData;
      }

      // Make API call
      console.log('🔍 Enhanced API - Making API call...');
      const result = await apiCall(abortControllerRef.current.signal);
      console.log('🔍 Enhanced API - API call result:', result);
      
      if (!mountedRef.current) return;

      console.log('🔍 Enhanced API - Setting data:', result);
      setData(result);
      setCachedData(result);
      setLoading(false);
      setRetryAttempt(0);
      onSuccess?.(result);
      console.log('🔍 Enhanced API - Data set, loading set to false');
      
      return result;
    } catch (err) {
      if (!mountedRef.current) return;

      // Don't retry if request was aborted
      if (err.name === 'AbortError') return;

      console.error(`API Error (attempt ${attempt + 1}):`, err);

      // Retry logic
      if (attempt < retryCount) {
        setTimeout(() => {
          if (mountedRef.current) {
            fetchData(attempt + 1);
          }
        }, retryDelay * Math.pow(2, attempt)); // Exponential backoff
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred';
        setError(errorMessage);
        setLoading(false);
        onError?.(errorMessage);
      }
    }
  }, [enabled, apiCall, retryCount, retryDelay, getCachedData, setCachedData, onSuccess, onError]);

  // Manual refetch function
  const refetch = useCallback(() => {
    return fetchData(0);
  }, [fetchData]);

  // Clear cache for this key
  const clearCache = useCallback(() => {
    const key = getCacheKey();
    cache.delete(key);
  }, [getCacheKey]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    if (enabled) {
      fetchData(0);
    }

    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [enabled, ...dependencies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Debug logging for return values
  console.log('🔍 Enhanced API Hook - Returning:', {
    hasData: !!data,
    dataType: typeof data,
    loading,
    error,
    retryAttempt
  });

  return {
    data,
    loading,
    error,
    refetch,
    clearCache,
    retryAttempt,
    isRetrying: retryAttempt > 0
  };
};

/**
 * Enhanced Products Hook
 */
export const useEnhancedProducts = (filters = {}, options = {}) => {
  console.log('🔍 useEnhancedProducts - Called with filters:', filters, 'options:', options);
  
  return useEnhancedApi(
    async (signal) => {
      console.log('🔍 useEnhancedProducts - API call function called with signal:', !!signal);
      const result = await apiService.getAllProducts(filters);
      console.log('🔍 useEnhancedProducts - API call completed with result:', result);
      return result;
    },
    [JSON.stringify(filters)],
    {
      cacheKey: `products_${JSON.stringify(filters)}`,
      ...options
    }
  );
};

/**
 * Enhanced Product Hook
 */
export const useEnhancedProduct = (id, options = {}) => {
  return useEnhancedApi(
    () => apiService.getProductById(id),
    [id],
    {
      cacheKey: `product_${id}`,
      enabled: !!id,
      ...options
    }
  );
};

/**
 * Enhanced Categories Hook
 */
export const useEnhancedCategories = (options = {}) => {
  return useEnhancedApi(
    () => Promise.resolve({
      success: true,
      data: [
        { _id: '1', name: 'Headlights', description: 'Car headlights and lighting' },
        { _id: '2', name: 'Tail Lights', description: 'Rear lighting systems' },
        { _id: '3', name: 'Interior RGB Lights', description: 'Interior lighting solutions' },
        { _id: '4', name: 'Fog Lights', description: 'Fog and auxiliary lighting' },
        { _id: '5', name: 'Underbody Glow', description: 'Underbody lighting kits' },
        { _id: '6', name: 'Floor Mats', description: 'Interior floor protection' },
        { _id: '7', name: 'Car Rims', description: 'Wheels and rims' },
        { _id: '8', name: 'Tires', description: 'Car tires and wheels' }
      ]
    }),
    [],
    {
      cacheKey: 'categories',
      ...options
    }
  );
};

/**
 * Enhanced Companies Hook
 */
export const useEnhancedCompanies = (options = {}) => {
  return useEnhancedApi(
    () => Promise.resolve({
      success: true,
      data: [
        { _id: '1', name: 'Mishimoto', logo: 'https://picsum.photos/150/150?random=1' },
        { _id: '2', name: 'Enkei Wheels', logo: 'https://picsum.photos/150/150?random=2' },
        { _id: '3', name: 'Borla Exhausts', logo: 'https://picsum.photos/150/150?random=3' },
        { _id: '4', name: 'Alpine Audio', logo: 'https://picsum.photos/150/150?random=4' },
        { _id: '5', name: 'Pioneer Car Audio', logo: 'https://picsum.photos/150/150?random=5' },
        { _id: '6', name: 'Nismo', logo: 'https://picsum.photos/150/150?random=6' },
        { _id: '7', name: 'K&N Filters', logo: 'https://picsum.photos/150/150?random=7' },
        { _id: '8', name: 'Greddy', logo: 'https://picsum.photos/150/150?random=8' }
      ]
    }),
    [],
    {
      cacheKey: 'companies',
      ...options
    }
  );
};

/**
 * Hook for handling wishlist products with enhanced data fetching
 */
export const useWishlistProducts = (wishlistItems = [], options = {}) => {
  const { data: allProducts, loading, error, refetch } = useEnhancedProducts({}, options);
  
  const wishlistProducts = useMemo(() => {
    if (!allProducts?.data) return [];
    
    const products = allProducts?.data || [];
    
    return wishlistItems
      .map(wishlistItem => {
        if (!wishlistItem?.id) return null;
        
        const fullProduct = products.find(product => 
          product?._id === wishlistItem.id || product?.id === wishlistItem.id
        );
        
        return fullProduct || wishlistItem;
      })
      .filter(Boolean);
  }, [allProducts, wishlistItems]);

  return {
    wishlistProducts,
    loading,
    error,
    refetch,
    hasProducts: wishlistProducts.length > 0
  };
};

export default useEnhancedApi;
