import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

/**
 * Optimized hooks for lazy loading products
 */

// Generic product fetcher with caching
const productCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useLazyProducts = (limit = 8, randomize = false) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    const cacheKey = `products_${limit}_${randomize}`;
    const cached = productCache.get(cacheKey);
    
    // Return cached data if valid
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setProducts(cached.data);
      return cached.data;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getAllProducts();
      let productList = response?.message || response?.data || [];
      
      if (randomize) {
        productList = shuffleArray([...productList]);
      }
      
      const limited = productList.slice(0, limit);
      
      // Cache the result
      productCache.set(cacheKey, {
        data: limited,
        timestamp: Date.now()
      });
      
      setProducts(limited);
      return limited;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch products';
      setError(errorMsg);
      console.error('Error fetching products:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [limit, randomize]);

  return { products, loading, error, fetchProducts };
};

// Fetch sale products
export const useSaleProducts = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getAllProducts();
      let productList = response?.message || response?.data || [];
      
      // Filter products on sale (salePrice < currentPrice)
      const saleProducts = productList.filter(p => 
        p?.salePrice && p?.currentPrice && p.salePrice < p.currentPrice
      );
      
      // Randomize and limit
      const randomized = shuffleArray(saleProducts);
      const limited = randomized.slice(0, limit);
      
      setProducts(limited);
      return limited;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch sale products';
      setError(errorMsg);
      console.error('Error fetching sale products:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [limit]);

  return { products, loading, error, fetchProducts };
};

// Fetch trending products (high rating or recent)
export const useTrendingProducts = (limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getAllProducts();
      let productList = response?.message || response?.data || [];
      
      // Sort by rating (descending) and take top products
      const sorted = [...productList].sort((a, b) => 
        (b?.rating || 0) - (a?.rating || 0)
      );
      
      const limited = sorted.slice(0, limit);
      setProducts(limited);
      return limited;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch trending products';
      setError(errorMsg);
      console.error('Error fetching trending products:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [limit]);

  return { products, loading, error, fetchProducts };
};

// Fetch products by category
export const useProductsByCategory = (categoryName, limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!categoryName) return [];
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getProductsByCategory(categoryName);
      let productList = response?.message || response?.data || [];
      
      const limited = productList.slice(0, limit);
      setProducts(limited);
      return limited;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch products';
      setError(errorMsg);
      console.error('Error fetching products by category:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [categoryName, limit]);

  return { products, loading, error, fetchProducts };
};

// Fetch products by company
export const useProductsByCompany = (companyName, limit = 8) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!companyName) return [];
    
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getProductsByCompany(companyName);
      let productList = response?.message || response?.data || [];
      
      const limited = productList.slice(0, limit);
      setProducts(limited);
      return limited;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch products';
      setError(errorMsg);
      console.error('Error fetching products by company:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [companyName, limit]);

  return { products, loading, error, fetchProducts };
};

// Utility: Shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default {
  useLazyProducts,
  useSaleProducts,
  useTrendingProducts,
  useProductsByCategory,
  useProductsByCompany
};
