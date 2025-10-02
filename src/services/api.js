const API_BASE_URL = 'http://localhost:8000/api/v1';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    try {
      console.log(`🔄 API Request: ${config.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error(`❌ API Error ${response.status}:`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log(`✅ API Success: ${config.method || 'GET'} ${endpoint}`, data.success ? '✓' : '✗');
      return data;
    } catch (error) {
      console.error('🚨 API Error Details:', {
        endpoint,
        method: config.method || 'GET',
        baseURL: this.baseURL,
        fullURL: url,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // Authentication methods
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/auth/profile', {
      method: 'GET',
    });
  }

  // Product methods
  async getAllProducts(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    const endpoint = queryParams.toString() ? `/products?${queryParams}` : '/products';
    return this.request(endpoint);
  }

  async getProductById(id) {
    return this.request(`/products/${id}`);
  }

  async getProductsByCategory(categoryName) {
    return this.request(`/products/category/${categoryName}`);
  }

  async getProductsByCompany(companyName) {
    return this.request(`/products/company/${companyName}`);
  }

  async searchProducts(query) {
    return this.request(`/products/search?q=${encodeURIComponent(query)}`);
  }

  // Category methods
  async getAllCategories() {
    return this.request('/categories');
  }

  async getCategoryById(id) {
    return this.request(`/categories/${id}`);
  }

  // Company methods
  async getAllCompanies() {
    return this.request('/companies');
  }

  async getCompanyById(id) {
    return this.request(`/companies/${id}`);
  }

  // Cart methods
  async addToCart(cartData) {
    return this.request('/cart', {
      method: 'POST',
      body: JSON.stringify(cartData),
    });
  }

  async removeFromCart(cartData) {
    return this.request('/cart', {
      method: 'DELETE',
      body: JSON.stringify(cartData),
    });
  }

  async getUserCart(userId) {
    return this.request(`/cart/${userId}`);
  }

  // Address methods
  async getUserAddresses() {
    return this.request('/addresses');
  }

  async addAddress(addressData) {
    return this.request('/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  // Order methods
  async createOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    return this.request('/orders');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
