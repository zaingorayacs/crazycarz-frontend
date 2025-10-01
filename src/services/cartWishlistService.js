import store from '../redux/store';
import { addToCart, updateQty, removeFromCart, clearCart } from '../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist, clearWishlist } from '../redux/slices/wishlistSlice';

/**
 * Centralized Cart and Wishlist Service
 * Provides consistent functions for managing cart and wishlist across the app
 */

// Cart Operations
export const cartService = {
  /**
   * Add product to cart
   * @param {Object} product - Product object to add
   * @param {number} quantity - Quantity to add (default: 1)
   * @returns {Object} - Action result
   */
  addProduct: (product, quantity = 1) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price || product.discountedPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: quantity,
      sku: product.sku || `SKU-${product.id}`,
    };
    
    store.dispatch(addToCart(productToAdd));
    return { success: true, product: productToAdd };
  },

  /**
   * Update product quantity in cart
   * @param {number} productId - Product ID
   * @param {number} quantity - New quantity
   * @returns {Object} - Action result
   */
  updateQuantity: (productId, quantity) => {
    store.dispatch(updateQty({ id: productId, qty: quantity }));
    return { success: true, productId, quantity };
  },

  /**
   * Remove product from cart
   * @param {number} productId - Product ID to remove
   * @returns {Object} - Action result
   */
  removeProduct: (productId) => {
    store.dispatch(removeFromCart(productId));
    return { success: true, productId };
  },

  /**
   * Clear entire cart
   * @returns {Object} - Action result
   */
  clearCart: () => {
    store.dispatch(clearCart());
    return { success: true };
  },

  /**
   * Get cart items
   * @returns {Array} - Cart items
   */
  getItems: () => {
    return store.getState().cart.cartItems;
  },

  /**
   * Get cart total
   * @returns {Object} - Cart totals
   */
  getTotals: () => {
    const cartItems = store.getState().cart.cartItems;
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 99;
    const total = subtotal + shipping;
    
    return {
      subtotal,
      shipping,
      total,
      itemCount: cartItems.length
    };
  }
};

// Wishlist Operations
export const wishlistService = {
  /**
   * Add product to wishlist
   * @param {Object} product - Product object to add
   * @returns {Object} - Action result
   */
  addProduct: (product) => {
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price || product.discountedPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      sku: product.sku || `SKU-${product.id}`,
    };
    
    store.dispatch(addToWishlist(productToAdd));
    return { success: true, product: productToAdd };
  },

  /**
   * Remove product from wishlist
   * @param {number} productId - Product ID to remove
   * @returns {Object} - Action result
   */
  removeProduct: (productId) => {
    store.dispatch(removeFromWishlist(productId));
    return { success: true, productId };
  },

  /**
   * Toggle product in wishlist (add if not present, remove if present)
   * @param {Object} product - Product object
   * @returns {Object} - Action result with action taken
   */
  toggleProduct: (product) => {
    const wishlistItems = store.getState().wishlist.wishlistItems;
    const productId = product.id || product._id;
    
    // Check if product is in wishlist (handle both string and number IDs)
    const existingItem = wishlistItems.find(item => 
      item.id === productId || 
      item.id === String(productId) || 
      item.id === Number(productId) ||
      item._id === productId
    );
    
    if (existingItem) {
      // Remove from wishlist
      store.dispatch(removeFromWishlist(existingItem.id));
      return { success: true, action: 'removed', product };
    } else {
      // Add to wishlist
      const productToAdd = {
        id: productId,
        name: product.name,
        price: product.price || product.discountedPrice,
        originalPrice: product.originalPrice,
        image: product.image,
        sku: product.sku || `SKU-${productId}`,
      };
      
      store.dispatch(addToWishlist(productToAdd));
      return { success: true, action: 'added', product: productToAdd };
    }
  },

  /**
   * Clear entire wishlist
   * @returns {Object} - Action result
   */
  clearWishlist: () => {
    store.dispatch(clearWishlist());
    return { success: true };
  },

  /**
   * Get wishlist items
   * @returns {Array} - Wishlist items
   */
  getItems: () => {
    return store.getState().wishlist.wishlistItems;
  },

  /**
   * Check if product is in wishlist
   * @param {number|string} productId - Product ID to check
   * @returns {boolean} - Whether product is in wishlist
   */
  isInWishlist: (productId) => {
    const wishlistItems = store.getState().wishlist.wishlistItems;
    // Handle both string and number IDs, and both _id and id formats
    return wishlistItems.some(item => 
      item.id === productId || 
      item.id === String(productId) || 
      item.id === Number(productId) ||
      item._id === productId
    );
  },

  /**
   * Move product from wishlist to cart
   * @param {Object} product - Product object
   * @param {number} quantity - Quantity to add to cart (default: 1)
   * @returns {Object} - Action result
   */
  moveToCart: (product, quantity = 1) => {
    // Remove from wishlist
    store.dispatch(removeFromWishlist(product.id));
    
    // Add to cart
    const productToAdd = {
      id: product.id,
      name: product.name,
      price: product.price || product.discountedPrice,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: quantity,
      sku: product.sku || `SKU-${product.id}`,
    };
    
    store.dispatch(addToCart(productToAdd));
    return { success: true, product: productToAdd };
  }
};

// Combined Operations
export const cartWishlistService = {
  /**
   * Add product to both cart and wishlist
   * @param {Object} product - Product object
   * @param {number} quantity - Quantity for cart (default: 1)
   * @returns {Object} - Action result
   */
  addToBoth: (product, quantity = 1) => {
    const cartResult = cartService.addProduct(product, quantity);
    const wishlistResult = wishlistService.addProduct(product);
    
    return {
      success: cartResult.success && wishlistResult.success,
      cart: cartResult,
      wishlist: wishlistResult
    };
  },

  /**
   * Get combined statistics
   * @returns {Object} - Combined stats
   */
  getStats: () => {
    const cartItems = cartService.getItems();
    const wishlistItems = wishlistService.getItems();
    const cartTotals = cartService.getTotals();
    
    return {
      cart: {
        itemCount: cartItems.length,
        totalItems: cartItems.reduce((total, item) => total + item.quantity, 0),
        ...cartTotals
      },
      wishlist: {
        itemCount: wishlistItems.length
      }
    };
  }
};

export default {
  cart: cartService,
  wishlist: wishlistService,
  combined: cartWishlistService
};
