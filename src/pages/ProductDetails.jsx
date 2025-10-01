import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaShoppingCart, FaCheck, FaMinus, FaPlus } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import products from '../data/products';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-hot-toast';
import { useProductData, useProductsData } from '../hooks/useProductData';
import SkeletonLoader from '../components/SkeletonLoader';
import ErrorMessage from '../components/ErrorMessage';
import { getCategoryName } from '../utils/productHelpers';
import useCartWishlist from '../hooks/useCartWishlist';

const ProductDetails = () => {
  const { id } = useParams();
  const [mainImage, setMainImage] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  
  // Fetch product data from API
  const { product: apiProduct, loading: apiLoading, error: apiError, refetch } = useProductData(id);
  
  // Fetch related products
  const { products: allProducts, loading: relatedLoading } = useProductsData();
  
  // Fallback to static data if API fails or no ID provided
  const staticProduct = id ? products.find(p => p.id === parseInt(id)) : products[0];
  const product = (!apiError && apiProduct) || staticProduct;
  const loading = apiLoading;
  
  // Get related products (exclude current product)
  const relatedProducts = allProducts?.filter(p => p?._id !== id && p?.id !== parseInt(id)).slice(0, 4) || 
                          products.filter(p => p.id !== product?.id).slice(0, 4);
  
  // Set main image when product loads
  useEffect(() => {
    if (product) {
      const firstImage = product?.images?.[0] || product?.image;
      if (firstImage) {
        setMainImage(firstImage);
      }
    }
  }, [product]);
  
  // Handle API error with fallback
  useEffect(() => {
    if (apiError && !useFallback) {
      console.warn('API failed, using static data:', apiError);
      setUseFallback(true);
    }
  }, [apiError, useFallback]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const dispatch = useDispatch();
  
  // Wishlist hook
  const { toggleWishlist: toggleWishlistHook, isInWishlist } = useCartWishlist();
  const isWishlisted = isInWishlist(product?._id || product?.id);

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }
    
    return stars;
  };

  // Format price with commas
  const formatPrice = (price) => {
    if (!price) return '0.00';
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Extract actual product data
  const productTitle = product?.title || product?.name || 'Product';
  const productPrice = product?.salePrice || product?.currentPrice || product?.price || 0;
  const originalPrice = product?.currentPrice || product?.originalPrice;
  const hasDiscount = productPrice < originalPrice;
  const discountAmount = hasDiscount ? Math.round(((originalPrice - productPrice) / originalPrice) * 100) : 0;
  const productImages = product?.images || [product?.image] || [];
  const productStock = product?.inStock || product?.stock || 0;
  const isInStock = productStock > 0;
  const categoryName = getCategoryName(product);
  const companyName = typeof product?.company === 'object' ? product?.company?.name : product?.company || 'N/A';
  const productTags = product?.tags || [];
  const shortDesc = product?.shortDescription || product?.description || '';
  const longDesc = product?.longDescription || product?.description || '';

  // Update quantity
  const updateQuantity = (change) => {
    if (!product) return;
    const maxStock = product?.stock || 10; // Default to 10 if stock is not available
    const newQuantity = Math.max(1, Math.min(maxStock, quantity + change));
    setQuantity(newQuantity);
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    if (!product) return;
    
    const productToToggle = {
      id: product?._id || product?.id,
      name: product?.name || product?.title,
      price: product?.price || product?.salePrice || product?.currentPrice,
      originalPrice: product?.originalPrice || product?.currentPrice,
      image: product?.images?.[0] || product?.image,
      sku: product?.sku || `SKU-${product?._id || product?.id}`
    };
    
    toggleWishlistHook(productToToggle);
  };


  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <SkeletonLoader type="product-detail" />
            
            <div className="mt-12">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-6 animate-pulse"></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <SkeletonLoader key={i} type="product" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Error state
  if (apiError && !product) {
    return (
      <Layout>
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <ErrorMessage
              title="Product Not Found"
              message="The product you're looking for doesn't exist or has been removed."
              onRetry={refetch}
            />
          </div>
        </div>
      </Layout>
    );
  }
  
  // No product found
  if (!product) {
    return (
      <Layout>
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <ErrorMessage
              title="Product Not Found"
              message="The product you're looking for doesn't exist."
              showRetry={false}
            />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="text-sm mb-6">
            <ol className="flex flex-wrap">
              <li className="flex items-center">
                <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="flex items-center">
                <a href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  {getCategoryName(product)}
                </a>
                <span className="mx-2 text-gray-400">/</span>
              </li>
              <li className="text-gray-700 dark:text-gray-300 font-medium truncate">{productTitle}</li>
            </ol>
          </nav>

          {/* Product Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6">
              {/* Product Images */}
              <div className="lg:col-span-2">
                <div className="mb-4 aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={mainImage || productImages[0] || 'https://via.placeholder.com/600x400?text=No+Image'} 
                    alt={productTitle}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/600x400?text=Image+Not+Found";
                    }}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {productImages.filter(Boolean).map((image, index) => (
                    <div 
                      key={index}
                      className={`aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden cursor-pointer border-2 ${
                        mainImage === image ? 'border-blue-500' : 'border-transparent'
                      }`}
                      onClick={() => setMainImage(image)}
                    >
                      <img 
                        src={image} 
                        alt={`${productTitle} - View ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Thumbnail";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:col-span-3">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">{productTitle}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {product && renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{product?.reviews || 0} reviews</span>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      ${formatPrice(productPrice)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xl text-gray-500 dark:text-gray-400 line-through">
                          ${formatPrice(originalPrice)}
                        </span>
                        <span className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 text-sm font-bold px-3 py-1 rounded-full">
                          Save {discountAmount}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Price includes all applicable taxes</p>
                </div>
                
                {shortDesc && (
                  <div className="mb-6">
                    <p className="text-gray-700 dark:text-gray-300 font-medium">{shortDesc}</p>
                  </div>
                )}
                
                {/* Product Info Cards */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Company</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{companyName}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Category</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{categoryName}</span>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg col-span-2">
                    <span className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Availability</span>
                    <span className={`flex items-center text-sm font-semibold ${
                      isInStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isInStock ? (
                        <>
                          <FaCheck size={14} className="mr-2" />
                          In Stock ({productStock} units available)
                        </>
                      ) : (
                        'Out of Stock'
                      )}
                    </span>
                  </div>
                </div>
                
                {/* Tags */}
                {productTags.length > 0 && (
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</span>
                    <div className="flex flex-wrap gap-2">
                      {productTags.map((tag, index) => (
                        <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center mb-6">
                  <div className="mr-4">
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quantity
                    </label>
                    <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                      <button 
                        onClick={() => updateQuantity(-1)}
                        className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={quantity <= 1}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="px-4 py-2 border-l border-r border-gray-300 dark:border-gray-600 min-w-[40px] text-center text-gray-900 dark:text-gray-100">
                        {quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(1)}
                        className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        disabled={quantity >= (product?.stock || 10)}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition-colors flex items-center justify-center"
                    onClick={() => {
                      try {
                        const productToAdd = {
                          id: product?._id || product?.id,
                          name: productTitle,
                          price: productPrice,
                          originalPrice: originalPrice,
                          image: productImages[0],
                          quantity: quantity,
                          sku: `SKU-${product?._id || product?.id}`
                        };
                        
                        console.log('Adding product to cart:', productToAdd);
                        dispatch(addToCart(productToAdd));
                        toast.success('Added to cart successfully!');
                        
                        // Verify cart state after adding
                        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
                        console.log('Cart after adding item:', cartItems);
                      } catch (error) {
                        console.error('Error adding product to cart:', error);
                        toast.error('Failed to add product to cart');
                      }
                    }}
                  >
                    <FaShoppingCart className="mr-2" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={toggleWishlist}
                    className={`px-4 py-3 rounded-md transition-colors flex items-center justify-center ${
                      isWishlisted 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    <FaHeart className={isWishlisted ? 'text-red-500' : ''} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden mb-8">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex flex-wrap">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === 'description'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === 'specifications'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Specifications
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`py-4 px-6 font-medium text-sm focus:outline-none ${
                    activeTab === 'reviews'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Reviews ({product?.reviewList?.length || 0})
                </button>
              </nav>
            </div>
            
            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Product Description</h2>
                  {longDesc ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {longDesc}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 italic">No detailed description available for this product.</p>
                  )}
                </div>
              )}
              
              {activeTab === 'specifications' && (
                <div>
                  <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">Product Information</h2>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-3 p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Company</div>
                      <div className="col-span-2 text-gray-700 dark:text-gray-300">{companyName}</div>
                    </div>
                    <div className="grid grid-cols-3 p-4 bg-white dark:bg-gray-800">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Category</div>
                      <div className="col-span-2 text-gray-700 dark:text-gray-300">{categoryName}</div>
                    </div>
                    <div className="grid grid-cols-3 p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Stock Status</div>
                      <div className="col-span-2 text-gray-700 dark:text-gray-300">
                        {isInStock ? `${productStock} units available` : 'Out of Stock'}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 p-4 bg-white dark:bg-gray-800">
                      <div className="font-semibold text-gray-900 dark:text-gray-100">Product ID</div>
                      <div className="col-span-2 text-gray-700 dark:text-gray-300 font-mono text-sm">{product?._id}</div>
                    </div>
                    {productTags.length > 0 && (
                      <div className="grid grid-cols-3 p-4 bg-gray-50 dark:bg-gray-700">
                        <div className="font-semibold text-gray-900 dark:text-gray-100">Tags</div>
                        <div className="col-span-2">
                          <div className="flex flex-wrap gap-2">
                            {productTags.map((tag, index) => (
                              <span key={index} className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Customer Reviews</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm">
                      Write a Review
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    {product?.reviewList ? product.reviewList.map(review => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{review.user}</h3>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    )) : (
                      <p className="text-gray-600 dark:text-gray-400">No reviews available yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedLoading ? (
                // Show skeleton loaders when loading
                Array.from({ length: 4 }, (_, index) => (
                  <SkeletonLoader key={index} type="product" />
                ))
              ) : (
                // Show actual products when loaded
                relatedProducts?.map(item => {
                  if (!item) return null;
                  return (
                    <ProductCard key={item?._id || item?.id || Math.random()} product={item} hideActions={true} />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;