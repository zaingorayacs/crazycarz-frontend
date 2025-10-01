import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useCartWishlist from '../hooks/useCartWishlist';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const Cart = () => {
  const { cartItems, updateCartQuantity, removeFromCart, clearCart, getCartTotals } = useCartWishlist();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log("Cart Debug:");
    console.log("Cart items:", cartItems);
    console.log("Cart items count:", cartItems.length);
    console.log("Cart totals:", getCartTotals());
  }, [cartItems, getCartTotals]);

  // Update quantity
  const updateQuantity = (id, change) => {
    try {
      const currentItem = cartItems.find(item => item.id === id);
      if (currentItem) {
        const newQty = Math.max(1, currentItem.quantity + change);
        updateCartQuantity(id, newQty, false); // Don't show toast for quantity updates
      } else {
        console.error('Item not found in cart:', id);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const removeItem = (id) => {
    try {
      removeFromCart(id);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };
  
  // Clear entire cart
  const handleClearCart = () => {
    try {
      clearCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  // Get cart totals using centralized function
  const cartTotals = getCartTotals();
  const { subtotal, shipping, total } = cartTotals || { subtotal: 0, shipping: 0, total: 0 };

  // Format price with commas
  const formatPrice = (price) => {
    try {
      if (typeof price !== 'number' || isNaN(price)) {
        console.warn('Invalid price value:', price);
        return '0.00';
      }
      return price?.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0.00';
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Shopping Cart</h1>
            {!isLoading && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {cartItems?.length || 0} {cartItems?.length === 1 ? 'item' : 'items'}
              </div>
            )}
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <SkeletonLoader key={index} type="cart-item" />
              ))}
            </div>
          ) : cartItems?.length === 0 ? (
            <EmptyState
              icon={() => (
                <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                </svg>
              )}
              title="Your cart is empty"
              message="Looks like you haven't added any products to your cart yet. Start shopping to fill it up!"
              actionText="Start Shopping"
              actionLink="/"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items - Left Side */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                      <span className="font-semibold text-gray-900 dark:text-gray-100">SELECT ALL ({cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''})</span>
                    </div>
                    <button 
                      onClick={handleClearCart}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  {/* Vendor Sections */}
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700">
                      <input type="checkbox" className="mr-2" />
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Taheri Supplies (Karachi) Selection</span>
                    </div>
                    
                    {/* Cart Items */}
                    {cartItems?.map(item => {
                      if (!item || !item.id) {
                        console.error('Invalid cart item:', item);
                        return null;
                      }
                      
                      return (
                        <div key={item?.id || Math.random()} className="flex flex-col sm:flex-row sm:items-center border-t border-gray-200 dark:border-gray-700 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center mb-4 sm:mb-0 sm:w-1/2">
                          <input type="checkbox" className="mr-4 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                          <div className="w-24 h-24 flex-shrink-0 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden shadow-sm">
                            <img 
                              src={item?.image || "https://picsum.photos/150/150?random=fallback"} 
                              alt={item?.name || "Product"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://picsum.photos/150/150?random=fallback";
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">{item?.name || "Unnamed Product"}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">No Brand</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:w-1/2 sm:justify-between">
                          {/* Price */}
                          <div className="mb-3 sm:mb-0">
                            <div className="text-red-500 dark:text-red-400 font-bold">Rs. {formatPrice(item?.price || 0)}</div>
                            {item?.originalPrice && item.originalPrice > (item?.price || 0) && (
                              <div className="text-gray-400 dark:text-gray-500 text-sm line-through">Rs. {formatPrice(item.originalPrice)}</div>
                            )}
                          </div>
                          
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => updateQuantity(item?.id, -1)}
                              className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="w-12 h-10 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold border-x border-gray-300 dark:border-gray-600">
                              {item?.quantity || 1}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item?.id, 1)}
                              className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center mt-3 sm:mt-0">
                            <button 
                              onClick={() => removeItem(item?.id)}
                              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              aria-label="Remove item"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Order Summary - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 sticky top-4">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal ({cartItems?.length || 0} items)</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">Rs. {formatPrice(subtotal || 0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Shipping Fee</span>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {(shipping || 0) === 0 ? (
                          <span className="text-green-600 dark:text-green-400 font-medium">Free</span>
                        ) : (
                          `Rs. ${formatPrice(shipping || 0)}`
                        )}
                      </span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                    <div className="flex justify-between items-center text-xl font-bold">
                      <span className="text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-red-500 dark:text-red-400">Rs. {formatPrice(total || 0)}</span>
                    </div>
                  </div>
                  
                  {/* Voucher Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Voucher Code
                    </label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter code" 
                        className="flex-grow border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Voucher code"
                      />
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm font-semibold rounded-lg transition-colors">
                        Apply
                      </button>
                    </div>
                  </div>
                  
                  {/* Checkout Button */}
                  <Link 
                    to="/checkout" 
                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8" />
                      </svg>
                      Proceed to Checkout
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Cart;