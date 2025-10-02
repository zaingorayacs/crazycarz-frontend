// API Service for CrazyCars Frontend
const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Products API methods
  async getAllProducts() {
    return this.request('/products');
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  async searchProducts(query) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  async getProductsByCategory(categoryId) {
    return this.request(`/products/category/${categoryId}`);
  }

  async getProductsByCompany(companyId) {
    return this.request(`/products/company/${companyId}`);
  }

  // Categories API methods
  async getAllCategories() {
    return this.request('/categories');
  }

  async getCategoryById(id) {
    return this.request(`/categories/${id}`);
  }

  // Companies API methods
  async getAllCompanies() {
    return this.request('/companies');
  }

  async getCompanyById(id) {
    return this.request(`/companies/${id}`);
  }

  // Orders API methods (if needed)
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrderById(id) {
    return this.request(`/orders/${id}`);
  }

  // User/Auth API methods (if needed)
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
