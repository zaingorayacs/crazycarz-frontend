import React, { useState, useEffect, useMemo } from 'react';
import Layout from '../components/Layout';
import { FaRegHeart, FaSyncAlt } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import useCartWishlist from '../hooks/useCartWishlist';
import { useEnhancedProducts } from '../hooks/useEnhancedApi';
import EnhancedSkeletonLoader from '../components/EnhancedSkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EnhancedEmptyState from '../components/EnhancedEmptyState';

// ...other imports remain the same

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useCartWishlist();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [removingItems, setRemovingItems] = useState(new Set());
  const [productsData, setProductsData] = useState(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const result = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}/products`);
        const data = await result.json();
        setProductsData(data);
        setProductsLoading(false);
      } catch (error) {
        setProductsError(error.message);
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const refetch = () => {};
  const retryAttempt = 0;
  const isRetrying = false;

  const allProducts = useMemo(() => {
    let extractedProducts = [];
    if (productsData?.data && Array.isArray(productsData.data)) {
      extractedProducts = productsData.data;
    } else if (productsData?.message && Array.isArray(productsData.message)) {
      extractedProducts = productsData.message;
    } else if (Array.isArray(productsData)) {
      extractedProducts = productsData;
    }
    return extractedProducts;
  }, [productsData]);

  // Fixed ID comparison using String()
  const wishlistProducts = useMemo(() => {
    if (!wishlistItems?.length || !allProducts?.length) return [];

    return wishlistItems
      .map(wishlistItem => {
        if (!wishlistItem?.id) return null;

        const fullProduct = allProducts.find(
          product => String(product?._id) === String(wishlistItem.id) || String(product?.id) === String(wishlistItem.id)
        );

        return fullProduct
          ? {
              ...fullProduct,
              wishlistId: wishlistItem.id,
              addedToWishlistAt: wishlistItem.addedAt
            }
          : {
              ...wishlistItem,
              _id: wishlistItem.id,
              name: wishlistItem.name || 'Product Name Unavailable',
              price: wishlistItem.price || 0,
              image: wishlistItem.image || 'https://via.placeholder.com/300x200?text=No+Image',
              isUnavailable: true
            };
      })
      .filter(Boolean);
  }, [wishlistItems, allProducts]);

  const isLoading = productsLoading;
  const hasWishlistItems = wishlistItems?.length > 0;
  const hasValidProducts = wishlistProducts?.length > 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRemoveItem = async productId => {
    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      await removeFromWishlist(productId);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to remove all items from your wishlist?')) {
      clearWishlist();
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Wishlist</h1>
              {!isLoading && (
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {wishlistItems?.length || 0} {wishlistItems?.length === 1 ? 'item' : 'items'}
                  {retryAttempt > 0 && (
                    <span className="ml-2 text-orange-500 dark:text-orange-400">(Retrying... attempt {retryAttempt})</span>
                  )}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading || isRefreshing}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh wishlist"
              >
                <FaSyncAlt className={`${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              {hasWishlistItems && !isLoading && (
                <button
                  onClick={handleClearWishlist}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <EnhancedSkeletonLoader type="wishlist-grid" count={8} className="mb-4" />
          ) : productsError ? (
            <ErrorMessage
              title="Unable to Load Wishlist"
              message={`${productsError}${isRetrying ? ' Retrying...' : ''}`}
              onRetry={handleRefresh}
              showRetry={!isRetrying}
            />
          ) : !hasWishlistItems ? (
            <EnhancedEmptyState type="wishlist" showAnimation={true} />
          ) : !hasValidProducts ? (
            <EnhancedEmptyState
              type="error"
              title="Wishlist Items Unavailable"
              message="The items in your wishlist are currently unavailable. They may have been removed or are temporarily out of stock."
              actionText="Browse Products"
              actionLink="/shop"
              secondaryActionText="Clear Wishlist"
              secondaryActionOnClick={handleClearWishlist}
            />
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {wishlistProducts.length} of {wishlistItems.length} items
                  {wishlistProducts.some(p => p.isUnavailable) && (
                    <span className="ml-2 text-orange-600 dark:text-orange-400">
                      (Some items may be unavailable)
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlistProducts.map(product => {
                  if (!product) return null;
                  const productId = product?._id || product?.id || product?.wishlistId;
                  const isRemoving = removingItems.has(productId);

                  return (
                    <div key={productId} className={`relative ${isRemoving ? 'opacity-50 pointer-events-none' : ''}`}>
                      {isRemoving && (
                        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 z-10 flex items-center justify-center rounded-lg">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                      )}
                      <ProductCard
                        product={product}
                        hideActions={true}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 text-center">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button
                    onClick={() => (window.location.href = '/shop')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    className="px-6 py-3 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium rounded-lg transition-colors"
                  >
                    Clear Wishlist
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Wishlist;
