import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

/**
 * Create axios instance with tenant-aware configuration
 */
export const createTenantApi = (tenantId) => {
  const instance = axios.create({
    baseURL: `${API_BASE_URL}/admin/${tenantId}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor to include auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        // Tenant access denied
        const message = error.response?.data?.message || 'Access denied to this tenant';
        console.error('Tenant access error:', message);
        
        // Optionally redirect to signin or show error
        if (message.includes('not authorized to access tenant')) {
          alert(message);
          window.location.href = '/admin/signin';
        }
      } else if (error.response?.status === 401) {
        // Unauthorized - token expired or invalid
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        window.location.href = '/admin/signin';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Get tenant ID from URL or localStorage
 */
export const getTenantId = () => {
  // Try to get from URL first
  const pathParts = window.location.pathname.split('/');
  const adminIndex = pathParts.indexOf('admin');
  if (adminIndex !== -1 && pathParts[adminIndex + 1]) {
    return pathParts[adminIndex + 1];
  }
  
  // Fallback to localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  return adminData.tenantId || null;
};

/**
 * Build tenant-aware URL for navigation
 */
export const buildTenantUrl = (path, tenantId = null) => {
  const tid = tenantId || getTenantId();
  if (!tid) {
    console.warn('No tenant ID available for building URL');
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  return `/admin/${tid}/${cleanPath}`;
};

/**
 * Hook-like function to get tenant API instance
 * Use this in components to make tenant-aware API calls
 */
export const useTenantApi = (tenantId) => {
  const tid = tenantId || getTenantId();
  if (!tid) {
    throw new Error('Tenant ID is required for API calls');
  }
  return createTenantApi(tid);
};
