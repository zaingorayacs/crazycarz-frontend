import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { cartService, wishlistService, cartWishlistService } from '../services/cartWishlistService';

/**
 * Custom hook for cart and wishlist operations with toast notifications
 */
export const useCartWishlist = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const wishlistItems = useSelector(state => state.wishlist.wishlistItems);

  // Cart operations with toast notifications
  const addToCart = (product, quantity = 1, showToast = true) => {
    try {
      const result = cartService.addProduct(product, quantity);
      if (showToast) {
        toast.success(`${product.name} added to cart!`);
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to add product to cart');
      }
      console.error('Error adding to cart:', error);
      return { success: false, error };
    }
  };

  const updateCartQuantity = (productId, quantity, showToast = true) => {
    try {
      const result = cartService.updateQuantity(productId, quantity);
      if (showToast && quantity === 0) {
        toast('Product removed from cart');
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to update quantity');
      }
      console.error('Error updating cart quantity:', error);
      return { success: false, error };
    }
  };

  const removeFromCart = (productId, showToast = true) => {
    try {
      const result = cartService.removeProduct(productId);
      if (showToast) {
        toast('Product removed from cart');
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to remove product from cart');
      }
      console.error('Error removing from cart:', error);
      return { success: false, error };
    }
  };

  const clearCart = (showToast = true) => {
    try {
      const result = cartService.clearCart();
      if (showToast) {
        toast('Cart cleared');
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to clear cart');
      }
      console.error('Error clearing cart:', error);
      return { success: false, error };
    }
  };

  // Wishlist operations with toast notifications
  const addToWishlist = (product, showToast = true) => {
    try {
      const result = wishlistService.addProduct(product);
      if (showToast) {
        toast.success(`${product.name} added to wishlist!`);
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to add product to wishlist');
      }
      console.error('Error adding to wishlist:', error);
      return { success: false, error };
    }
  };

  const removeFromWishlist = (productId, showToast = true) => {
    try {
      const result = wishlistService.removeProduct(productId);
      if (showToast) {
        toast('Product removed from wishlist');
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to remove product from wishlist');
      }
      console.error('Error removing from wishlist:', error);
      return { success: false, error };
    }
  };

  const toggleWishlist = (product, showToast = true) => {
    try {
      const result = wishlistService.toggleProduct(product);
      
      if (showToast) {
        if (result.action === 'added') {
          toast.success(`${product.name} added to wishlist!`);
        } else {
          toast(`${product.name} removed from wishlist`);
        }
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to toggle wishlist');
      }
      console.error('Error toggling wishlist:', error);
      return { success: false, error };
    }
  };

  const clearWishlist = (showToast = true) => {
    try {
      const result = wishlistService.clearWishlist();
      if (showToast) {
        toast('Wishlist cleared');
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to clear wishlist');
      }
      console.error('Error clearing wishlist:', error);
      return { success: false, error };
    }
  };

  const moveToCart = (product, quantity = 1, showToast = true) => {
    try {
      const result = wishlistService.moveToCart(product, quantity);
      if (showToast) {
        toast.success(`${product.name} moved to cart!`);
      }
      return result;
    } catch (error) {
      if (showToast) {
        toast.error('Failed to move product to cart');
      }
      console.error('Error moving to cart:', error);
      return { success: false, error };
    }
  };

  // Utility functions
  const isInWishlist = (productId) => {
    return wishlistService.isInWishlist(productId);
  };

  const getCartTotals = () => {
    return cartService.getTotals();
  };

  const getStats = () => {
    return cartWishlistService.getStats();
  };

  return {
    // State
    cartItems,
    wishlistItems,
    
    // Cart operations
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    
    // Wishlist operations
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
    moveToCart,
    
    // Utility functions
    isInWishlist,
    getCartTotals,
    getStats
  };
};

export default useCartWishlist;
