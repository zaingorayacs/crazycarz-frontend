import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaShoppingCart, FaBolt, FaTruck, FaUndo, FaChevronLeft, FaChevronRight, FaRefresh, FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';

import Layout from '../components/Layout';
import SimpleProductCard from '../components/SimpleProductCard';
import EnhancedSkeletonLoader from '../components/EnhancedSkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import EnhancedEmptyState from '../components/EnhancedEmptyState';
import products from '../data/products';
import { useEnhancedProduct, useEnhancedProducts } from '../hooks/useEnhancedApi';
import useCartWishlist from '../hooks/useCartWishlist';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCartWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch product data from API with enhanced error handling
  const { 
    data: apiProduct, 
    loading: apiLoading, 
    error: apiError, 
    refetch: refetchProduct,
    retryAttempt,
    isRetrying
  } = useEnhancedProduct(id, {
    onError: (error) => {
      console.error('Failed to load product:', error);
    },
    onSuccess: (data) => {
      console.log('Product loaded successfully:', data?._id || data?.id);
    }
  });
  
  // Fetch related products
  const { 
    data: allProductsData, 
    loading: relatedLoading,
    error: relatedError,
    refetch: refetchRelated
  } = useEnhancedProducts({}, {
    onError: (error) => {
      console.error('Failed to load related products:', error);
    }
  });
  
  // Extract and validate product data
  const product = useMemo(() => {
    // Try API product first
    if (apiProduct && !apiError) {
      return apiProduct;
    }
    
    // Fallback to static data
    const staticProduct = products.find(p => p.id === parseInt(id));
    if (staticProduct) {
      return {
        ...staticProduct,
        isFallback: true
      };
    }
    
    return null;
  }, [apiProduct, apiError, id]);
  
  // Get related products (exclude current product)
  const relatedProducts = useMemo(() => {
    const allProducts = allProductsData?.message || allProductsData?.data || [];
    
    if (allProducts.length > 0) {
      return allProducts
        .filter(p => p?._id !== id && p?.id !== parseInt(id))
        .slice(0, 4);
    }
    
    // Fallback to static products
    return products
      .filter(p => p.id !== parseInt(id))
      .slice(0, 4);
  }, [allProductsData, id]);
  
  const loading = apiLoading;
  const isInWishlistState = product ? isInWishlist(product._id || product.id) : false;
  
  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchProduct(),
        refetchRelated()
      ]);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchProduct, refetchRelated]);
  
  // Reset image selection when product changes
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [id, product]);

  // -----------------
  // Loading State
  // -----------------
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EnhancedSkeletonLoader type="product-detail-enhanced" />
        </div>
      </Layout>
    );
  }

  // -----------------
  // Error State
  // -----------------
  if (apiError && !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <ErrorMessage
            title="Product Not Found"
            message={`${apiError}${isRetrying ? ' Retrying...' : ''}`}
            onRetry={handleRefresh}
            showRetry={!isRetrying}
          />
          <div className="text-center mt-6">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 inline-block">
                Browse Products
              </Link>
              <button 
                onClick={() => navigate(-1)}
                className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // -----------------
  // No Product Found
  // -----------------
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <EnhancedEmptyState
            type="error"
            title="Product Not Found"
            message="The product you're looking for doesn't exist or has been removed from our catalog."
            actionText="Browse Products"
            actionLink="/shop"
            secondaryActionText="Go Back"
            secondaryActionOnClick={() => navigate(-1)}
          />
        </div>
      </Layout>
    );
  }

  // -----------------
  // Product Data Setup
  // -----------------
  const productImages = product?.images || [
    { id: 0, url: product?.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=60' },
    { id: 1, url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=60' },
    { id: 2, url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=60' },
    { id: 3, url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=60' },
  ];

  const hasDiscount = (product?.discount || 0) > 0 || (product?.salePrice && product?.salePrice < product?.currentPrice);
  const discountedPrice = hasDiscount
    ? (product?.salePrice || Math.round(product?.originalPrice - (product?.originalPrice * product?.discount) / 100))
    : (product?.currentPrice || product?.originalPrice || product?.price || 0);

  const formattedPrice = discountedPrice?.toLocaleString("en-IN") || '0';
  const formattedOriginalPrice = hasDiscount ? (product?.originalPrice || product?.currentPrice)?.toLocaleString("en-IN") : null;

  const specifications = {
    engine: 'V8 Twin Turbo',
    power: '550 HP',
    acceleration: '0-60 mph in 3.5s',
    topSpeed: '200 mph',
    transmission: '8-speed Automatic',
    fuelEconomy: '18 city / 24 highway',
    seating: '2',
    cargo: '8.8 cubic feet',
  };

  const reviews = [
    { id: 1, user: 'John D.', rating: 5, date: '2023-05-15', comment: 'Excellent car! Exceeded my expectations in every way.' },
    { id: 2, user: 'Sarah M.', rating: 4, date: '2023-04-22', comment: 'Great performance and comfort. Fuel efficiency could be better.' },
    { id: 3, user: 'Michael T.', rating: 5, date: '2023-03-10', comment: 'Best purchase I have made. The handling is superb and the interior is luxurious.' },
  ];

  // -----------------
  // Handlers
  // -----------------
  const handlePrevImage = () => {
    setSelectedImage(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImage(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) setQuantity(value);
  };

  const handleAddToCart = useCallback(async () => {
    if (!product) return;
    
    setIsAddingToCart(true);
    try {
      const productToAdd = {
        id: product?._id || product?.id,
        name: product?.name || product?.title,
        price: discountedPrice,
        originalPrice: product?.originalPrice || product?.currentPrice,
        image: product?.image || product?.images?.[0],
        quantity,
        sku: product?.sku || `SKU-${product?._id || product?.id}`,
      };
      
      dispatch(addToCart(productToAdd));
      toast.success(`Added ${quantity} item(s) to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  }, [product, discountedPrice, quantity, dispatch]);
  
  const handleToggleWishlist = useCallback(async () => {
    if (!product) return;
    
    setIsTogglingWishlist(true);
    try {
      const productId = product._id || product.id;
      
      if (isInWishlistState) {
        await removeFromWishlist(productId);
        toast.success('Removed from wishlist');
      } else {
        const wishlistItem = {
          id: productId,
          name: product.name || product.title,
          price: discountedPrice,
          image: product.image || product.images?.[0],
        };
        await addToWishlist(wishlistItem);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsTogglingWishlist(false);
    }
  }, [product, isInWishlistState, addToWishlist, removeFromWishlist, discountedPrice]);

  // -----------------
  // Render
  // -----------------
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header with breadcrumb and actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/shop" className="hover:text-blue-600 dark:hover:text-blue-400">Shop</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
              {product?.name || product?.title}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Fallback indicator */}
            {product?.isFallback && (
              <span className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                Limited Data
              </span>
            )}
            
            {/* Retry indicator */}
            {retryAttempt > 0 && (
              <span className="text-xs text-orange-500 dark:text-orange-400">
                Retrying... ({retryAttempt})
              </span>
            )}
            
            {/* Refresh button */}
            <button
              onClick={handleRefresh}
              disabled={loading || isRefreshing}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh product data"
            >
              <FaRefresh className={`${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-96">
              <motion.img
                key={selectedImage}
                src={productImages[selectedImage]?.url || productImages[selectedImage]}
                alt={product?.name || product?.title}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=60';
                }}
              />
              <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-600">
                <FaChevronLeft />
              </button>
              <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-700/80 p-2 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-600">
                <FaChevronRight />
              </button>
              <div className="absolute top-2 right-2 bg-white/80 dark:bg-gray-700/80 text-xs px-2 py-1 rounded text-gray-900 dark:text-gray-100">Click to zoom</div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {productImages.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={img?.url || img} 
                    alt={`${product?.name || product?.title} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=800&q=60';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{product?.name || product?.title || 'Product'}</h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className={i < Math.floor(product?.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400">{product?.rating || 0} ({product?.reviews || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">₹{formattedPrice}</span>
                {hasDiscount && (
                  <>
                    <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">₹{formattedOriginalPrice}</span>
                    <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-sm font-medium">
                      {product?.discount || Math.round(((product?.originalPrice - discountedPrice) / product?.originalPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inclusive of all taxes</p>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label htmlFor="quantity" className="block text-sm font-medium mb-1 text-gray-900 dark:text-gray-100">Quantity</label>
              <div className="flex items-center">
                <button onClick={() => quantity > 1 && setQuantity(quantity - 1)} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">-</button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="w-16 text-center border-t border-b border-gray-300 dark:border-gray-600 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100">+</button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FaShoppingCart />
                )}
                {isAddingToCart ? 'Adding...' : 'Add to Cart'}
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className="bg-orange-500 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 hover:bg-orange-600"
                onClick={() => {
                  handleAddToCart();
                  setTimeout(() => navigate('/checkout'), 500);
                }}
                disabled={isAddingToCart}
              >
                <FaBolt /> Buy Now
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.98 }}
                className={`p-3 rounded-md border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isInWishlistState 
                    ? 'border-red-500 bg-red-500 text-white hover:bg-red-600' 
                    : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-500 hover:text-red-500'
                }`}
                onClick={handleToggleWishlist}
                disabled={isTogglingWishlist}
                title={isInWishlistState ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isTogglingWishlist ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : isInWishlistState ? (
                  <FaHeart />
                ) : (
                  <FaRegHeart />
                )}
              </motion.button>
            </div>

            {/* Shipping Info */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-6 bg-white dark:bg-gray-800">
              <h3 className="font-medium mb-2 text-gray-900 dark:text-gray-100">Delivery & Returns</h3>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <FaTruck className="text-gray-500 dark:text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Free shipping</p>
                    <p className="text-gray-500 dark:text-gray-400">Estimated delivery: 3-5 business days</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <FaUndo className="text-gray-500 dark:text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">Easy returns</p>
                    <p className="text-gray-500 dark:text-gray-400">30-day return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="mb-12">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-6">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Product Description</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{product?.description || 'No description available.'}</p>
                <p className="text-gray-700 dark:text-gray-300">Experience the thrill of driving with our {product?.name || product?.title}...</p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <div>
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-gray-500 dark:text-gray-400 capitalize">{key}: </span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Customer Reviews</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">Write a Review</button>
                </div>
                <div className="mb-8">
                  <div className="flex items-center mb-2">
                    <div className="flex mr-2">{[...Array(5)].map((_, i) => <FaStar key={i} className="text-yellow-400" />)}</div>
                    <span className="text-lg font-medium text-gray-900 dark:text-gray-100">{product?.rating || 0} out of 5</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">{product?.reviews || 0} global ratings</p>
                </div>
                <div className="space-y-6">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                      <div className="flex items-center mb-2">
                        <span className="font-medium mr-2 text-gray-900 dark:text-gray-100">{review.user}</span>
                        <div className="flex">{[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} />
                        ))}</div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{review.date}</p>
                      <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Related Products</h2>
            {relatedError && (
              <span className="text-sm text-orange-600 dark:text-orange-400">
                Limited recommendations
              </span>
            )}
          </div>
          
          {relatedLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, i) => (
                <EnhancedSkeletonLoader key={i} type="product" />
              ))}
            </div>
          ) : relatedProducts?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map(rp => {
                if (!rp) return null;
                return (
                  <SimpleProductCard 
                    key={rp?._id || rp?.id || Math.random()} 
                    product={rp} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                No related products available
              </p>
              <Link 
                to="/shop" 
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
