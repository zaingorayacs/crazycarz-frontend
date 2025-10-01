import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, removeFromCart, updateQty } from '../redux/slices/cartSlice';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const CartPage = () => {
  const cart = useSelector(state => state.cart);
  const cartItems = cart?.cartItems || [];
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading cart data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleUpdateQty = (id, qty) => {
    if (qty < 1) return;
    dispatch(updateQty({ id, qty }));
  };

  const calculateTotal = () => {
    return cartItems?.reduce((total, item) => total + ((item?.price || 0) * (item?.quantity || 1)), 0) || 0;
  };

  const totalItems = cartItems?.reduce((total, item) => total + (item?.quantity || 1), 0) || 0;

  // Debug logging
  useEffect(() => {
    console.log("CartPage Debug:");
    console.log("Cart items:", cartItems);
    console.log("Cart items count:", cartItems.length);
    console.log("Total items:", totalItems);
    console.log("Calculate total:", calculateTotal());
  }, [cartItems, totalItems, calculateTotal]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Your Cart</h1>
        
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
            message="Looks like you haven't added any cars to your cart yet."
            actionText="Shop Now"
            actionLink="/"
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side (2/3 width on large screens) */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
                {cartItems?.map(item => {
                  if (!item || !item.id) {
                    console.error('Invalid cart item:', item);
                    return null;
                  }
                  
                  return (
                    <div key={item?.id || Math.random()} className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-700 py-4">
                    <div className="flex items-center mb-4 sm:mb-0">
                      <img 
                        src={item?.image || "https://picsum.photos/64/64?random=fallback"} 
                        alt={item?.name || "Product"} 
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://picsum.photos/64/64?random=fallback";
                        }}
                      />
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{item?.name || "Unnamed Product"}</h3>
                        <p className="text-gray-600 dark:text-gray-400">${(item?.price || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded mr-6">
                        <button 
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => handleUpdateQty(item?.id, (item?.quantity || 1) - 1)}
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-gray-900 dark:text-gray-100">{item?.quantity || 1}</span>
                        <button 
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => handleUpdateQty(item?.id, (item?.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-100">${((item?.price || 0) * (item?.quantity || 1)).toLocaleString()}</p>
                        <button 
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                          onClick={() => handleRemoveItem(item?.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  );
                })}
                
                <div className="mt-6">
                  <button 
                    className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
            
            {/* Cart Summary - Right Side (1/3 width on large screens) */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4 pb-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">Cart Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Items:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total:</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${calculateTotal().toLocaleString()}</span>
                  </div>
                  
                  <Link to="/checkout" className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium">
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;