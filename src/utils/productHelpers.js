/**
 * Product Helper Utilities
 * Common functions for handling product data safely
 */

/**
 * Safely get category name from product
 * Handles both string and object category formats
 * @param {Object} product - Product object
 * @returns {string} - Category name or default value
 */
export const getCategoryName = (product) => {
  if (!product?.category) return 'N/A';
  
  // If category is an object with name property
  if (typeof product.category === 'object' && product.category.name) {
    return product.category.name;
  }
  
  // If category is a string
  if (typeof product.category === 'string') {
    return product.category;
  }
  
  return 'N/A';
};

/**
 * Safely get company/brand name from product
 * Handles both string and object formats
 * @param {Object} product - Product object
 * @returns {string} - Company/brand name or default value
 */
export const getCompanyName = (product) => {
  const company = product?.company || product?.brand;
  
  if (!company) return 'N/A';
  
  // If company is an object with name property
  if (typeof company === 'object' && company.name) {
    return company.name;
  }
  
  // If company is a string
  if (typeof company === 'string') {
    return company;
  }
  
  return 'N/A';
};

/**
 * Safely get product name
 * @param {Object} product - Product object
 * @returns {string} - Product name or default value
 */
export const getProductName = (product) => {
  return product?.name || product?.title || 'Unnamed Product';
};

/**
 * Safely get product price
 * @param {Object} product - Product object
 * @returns {number} - Product price or 0
 */
export const getProductPrice = (product) => {
  return product?.price || product?.salePrice || product?.currentPrice || 0;
};

/**
 * Safely get product original price
 * @param {Object} product - Product object
 * @returns {number|null} - Original price or null
 */
export const getProductOriginalPrice = (product) => {
  return product?.originalPrice || product?.currentPrice || null;
};

/**
 * Safely get product image
 * @param {Object} product - Product object
 * @param {number} index - Image index (default: 0)
 * @returns {string} - Image URL or fallback
 */
export const getProductImage = (product, index = 0) => {
  if (product?.images && Array.isArray(product.images) && product.images[index]) {
    return product.images[index];
  }
  
  if (product?.image) {
    return product.image;
  }
  
  return 'https://via.placeholder.com/400x300?text=No+Image';
};

/**
 * Calculate discount percentage
 * @param {Object} product - Product object
 * @returns {number} - Discount percentage or 0
 */
export const getDiscountPercentage = (product) => {
  const originalPrice = getProductOriginalPrice(product);
  const currentPrice = getProductPrice(product);
  
  if (!originalPrice || originalPrice <= currentPrice) {
    return 0;
  }
  
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

/**
 * Check if product has discount
 * @param {Object} product - Product object
 * @returns {boolean} - True if product has discount
 */
export const hasDiscount = (product) => {
  return getDiscountPercentage(product) > 0;
};

/**
 * Format price with currency
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol (default: '$')
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currency = '$') => {
  if (typeof price !== 'number' || isNaN(price)) {
    return `${currency}0.00`;
  }
  
  return `${currency}${price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

/**
 * Safely get product stock status
 * @param {Object} product - Product object
 * @returns {Object} - Stock status object
 */
export const getStockStatus = (product) => {
  const stock = product?.stock || 0;
  
  return {
    inStock: stock > 0,
    quantity: stock,
    message: stock > 0 ? `In Stock (${stock} available)` : 'Out of Stock'
  };
};

/**
 * Safely get product rating
 * @param {Object} product - Product object
 * @returns {number} - Rating (0-5)
 */
export const getProductRating = (product) => {
  const rating = product?.rating || 0;
  return Math.max(0, Math.min(5, rating)); // Clamp between 0 and 5
};

/**
 * Safely get product reviews count
 * @param {Object} product - Product object
 * @returns {number} - Reviews count
 */
export const getReviewsCount = (product) => {
  return product?.reviews || product?.reviewCount || 0;
};

/**
 * Get product ID (handles both _id and id)
 * @param {Object} product - Product object
 * @returns {string|number} - Product ID
 */
export const getProductId = (product) => {
  return product?._id || product?.id;
};

/**
 * Get product SKU
 * @param {Object} product - Product object
 * @returns {string} - Product SKU
 */
export const getProductSKU = (product) => {
  return product?.sku || `SKU-${getProductId(product)}`;
};

export default {
  getCategoryName,
  getCompanyName,
  getProductName,
  getProductPrice,
  getProductOriginalPrice,
  getProductImage,
  getDiscountPercentage,
  hasDiscount,
  formatPrice,
  getStockStatus,
  getProductRating,
  getReviewsCount,
  getProductId,
  getProductSKU
};
