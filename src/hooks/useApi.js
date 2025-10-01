import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('useApi: API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Specific hooks for common API calls
export const useProducts = (filters = {}) => {
  return useApi(() => apiService.getAllProducts(filters), [JSON.stringify(filters)]);
};

export const useProduct = (id) => {
  return useApi(() => apiService.getProductById(id), [id]);
};

export const useCategories = () => {
  // For now, return mock data since categories require admin auth
  return useApi(() => Promise.resolve({
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
  }));
};

export const useCompanies = () => {
  // For now, return mock data since companies require admin auth
  return useApi(() => Promise.resolve({
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
  }));
};

export const useProductsByCategory = (categoryName) => {
  return useApi(() => apiService.getProductsByCategory(categoryName), [categoryName]);
};

export const useProductsByCompany = (companyName) => {
  return useApi(() => apiService.getProductsByCompany(companyName), [companyName]);
};

export const useUserCart = (userId) => {
  return useApi(() => apiService.getUserCart(userId), [userId]);
};
