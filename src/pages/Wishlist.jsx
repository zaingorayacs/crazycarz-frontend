import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { FaRegHeart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import useCartWishlist from '../hooks/useCartWishlist';
import { useProducts } from '../hooks/useApi';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

const Wishlist = () => {
  // Get wishlist items using centralized hook
  const { wishlistItems } = useCartWishlist();
  
  // Fetch products from API
  const { data: productsData, loading: productsLoading, error: productsError, refetch } = useProducts();
  
  // Extract products from API response with safe handling
  const allProducts = productsData?.message || productsData || [];
  
  // Match wishlist items with full product data from API
  const wishlistProducts = wishlistItems?.map(wishlistItem => {
    if (!wishlistItem) return null;
    const fullProduct = allProducts.find(product => product?._id === wishlistItem?.id);
    return fullProduct || wishlistItem; // Fallback to wishlist item if product not found
  }).filter(Boolean) || []; // Remove null/undefined items
  
  const isLoading = productsLoading;
  const hasWishlistItems = wishlistItems?.length > 0;
  
  // Debug logging
  useEffect(() => {
    console.log("Wishlist Debug:");
    console.log("Wishlist items:", wishlistItems);
    console.log("All products:", allProducts);
    console.log("Wishlist products:", wishlistProducts);
    console.log("Products loading:", productsLoading);
    console.log("Products error:", productsError);
  }, [wishlistItems, allProducts, wishlistProducts, productsLoading, productsError]);


  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Wishlist</h1>
            {!isLoading && (
              <span className="text-gray-600 dark:text-gray-400">{wishlistItems?.length || 0} items</span>
            )}
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }, (_, index) => (
                <SkeletonLoader key={index} type="product" />
              ))}
            </div>
          ) : productsError ? (
            <ErrorMessage
              title="Error Loading Products"
              message={productsError || "Failed to load product data. Please try again."}
              onRetry={refetch}
            />
          ) : !hasWishlistItems ? (
            <EmptyState
              icon={FaRegHeart}
              title="Your wishlist is empty"
              message="Add items you love to your wishlist. Review them anytime and easily move them to the cart."
              actionText="Continue Shopping"
              actionLink="/"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map(product => {
                if (!product) return null;
                return (
                  <ProductCard 
                    key={product?._id || product?.id || Math.random()} 
                    product={product} 
                    hideActions={true} 
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;