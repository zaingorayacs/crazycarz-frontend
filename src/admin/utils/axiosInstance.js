// utils/axiosInstance.js
import axios from "axios";
import store from '../store/store';
import { logout } from '../store/authSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1",
  withCredentials: true // Send cookies automatically
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      store.dispatch(logout());
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/admin/signin') {
        window.location.href = '/admin/signin';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;






