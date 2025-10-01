import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

/**
 * Enhanced hook for fetching product data with comprehensive error handling
 * @param {string} productId - Product ID to fetch
 * @returns {Object} - { product, loading, error, refetch }
 */
export const useProductData = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setLoading(false);
      setError('No product ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProductById(productId);
      
      // Handle different response structures
      const productData = response?.data || response?.product || response;
      
      if (!productData) {
        throw new Error('Product not found');
      }
      
      setProduct(productData);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { 
    product, 
    loading, 
    error, 
    refetch: fetchProduct 
  };
};

/**
 * Enhanced hook for fetching products list with comprehensive error handling
 * @param {Object} filters - Filters to apply
 * @returns {Object} - { products, loading, error, refetch }
 */
export const useProductsData = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getAllProducts(filters);
      
      // Handle different response structures
      const productsData = response?.message || response?.data || response?.products || response;
      
      if (!Array.isArray(productsData)) {
        throw new Error('Invalid products data format');
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchProducts,
    isEmpty: !loading && !error && products.length === 0
  };
};

/**
 * Enhanced hook for fetching products by category
 * @param {string} categoryName - Category name
 * @returns {Object} - { products, loading, error, refetch }
 */
export const useProductsByCategory = (categoryName) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!categoryName) {
      setLoading(false);
      setError('No category provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProductsByCategory(categoryName);
      
      // Handle different response structures
      const productsData = response?.message || response?.data || response?.products || response;
      
      if (!Array.isArray(productsData)) {
        throw new Error('Invalid products data format');
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchProducts,
    isEmpty: !loading && !error && products.length === 0
  };
};

/**
 * Enhanced hook for fetching products by company
 * @param {string} companyName - Company name
 * @returns {Object} - { products, loading, error, refetch }
 */
export const useProductsByCompany = (companyName) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!companyName) {
      setLoading(false);
      setError('No company provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.getProductsByCompany(companyName);
      
      // Handle different response structures
      const productsData = response?.message || response?.data || response?.products || response;
      
      if (!Array.isArray(productsData)) {
        throw new Error('Invalid products data format');
      }
      
      setProducts(productsData);
    } catch (err) {
      console.error('Error fetching products by company:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [companyName]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { 
    products, 
    loading, 
    error, 
    refetch: fetchProducts,
    isEmpty: !loading && !error && products.length === 0
  };
};

export default {
  useProductData,
  useProductsData,
  useProductsByCategory,
  useProductsByCompany
};
