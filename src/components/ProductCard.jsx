import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaStar, FaShoppingCart, FaHeart } from "react-icons/fa";
import useCartWishlist from "../hooks/useCartWishlist";
import SkeletonLoader from "./SkeletonLoader";

const ProductCard = ({ product, hideActions = false, isLoading = false }) => {
  const [showFeedback, setShowFeedback] = useState({ cart: false, wishlist: false });
  const { addToCart, toggleWishlist, isInWishlist: checkIsInWishlist } = useCartWishlist();
  
  if (isLoading) {
    return <SkeletonLoader type="product" className="max-w-xs" />;
  }
  
  if (!product) {
    console.warn("ProductCard rendered with a null or undefined product.");
    return null;
  }

  const {
    _id: id,
    title: name = "Unnamed Product",
    currentPrice: originalPrice,
    salePrice,
    images,
    rating = 0,
    reviews = 0,
    price = salePrice || originalPrice,
    sku = `SKU-${id || Math.floor(Math.random() * 10000)}`,
  } = product;

  // Get product image
  const image = images?.[0] || product?.image || "https://picsum.photos/400/300?random=car";

  // Calculate discounted price
  const hasDiscount = salePrice > 0 && salePrice < originalPrice;
  const discountedPrice = hasDiscount ? salePrice : originalPrice;
  const discount = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  // Format prices
  const formattedPrice = discountedPrice?.toLocaleString("en-IN");
  const formattedOriginalPrice =
    hasDiscount && originalPrice
      ? originalPrice.toLocaleString("en-IN")
      : null;

  const filledStars = Math.round(rating);
  
  // Check if product is in wishlist
  const isInWishlist = checkIsInWishlist(id);

  // Enhanced click handler for debugging
  const handleClick = (e) => {
    console.log("Product clicked:", {
      id,
      name,
      price: discountedPrice,
      originalPrice,
      discount,
      image,
      rating,
      reviews
    });
    // The Link component will handle navigation automatically
  };
  
  // Add to Cart handler
  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    const productToAdd = {
      id,
      name,
      price: discountedPrice,
      originalPrice,
      image,
      sku,
    };
    
    addToCart(productToAdd);
    
    // Show feedback
    setShowFeedback(prev => ({ ...prev, cart: true }));
    setTimeout(() => {
      setShowFeedback(prev => ({ ...prev, cart: false }));
    }, 2000);
  };
  
  // Add to Wishlist handler
  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    console.log('Wishlist toggle clicked for product:', { id, name });
    
    const productToToggle = {
      id,
      name,
      price: discountedPrice,
      originalPrice,
      image,
      sku,
    };
    
    console.log('Product to toggle:', productToToggle);
    
    try {
      const result = toggleWishlist(productToToggle);
      console.log('Toggle result:', result);
      
      // Show feedback
      setShowFeedback(prev => ({ ...prev, wishlist: true }));
      setTimeout(() => {
        setShowFeedback(prev => ({ ...prev, wishlist: false }));
      }, 2000);
    } catch (error) {
      console.error('Error in handleWishlistToggle:', error);
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden w-full max-w-xs hover:shadow-lg">
      <Link
        to={`/product/${id}`}
        className="block cursor-pointer" 
        onClick={handleClick}
      >
        {/* Product Image */}
        <div className="relative w-full h-48">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://picsum.photos/400/300?random=fallback";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="p-2 text-left">
          {/* Product Name */}
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1 line-clamp-2">
            {name}
          </h3>

          {/* Price + Discount */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-red-500">
              Rs.{formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className="text-gray-400 dark:text-gray-500 text-sm line-through">
                Rs.{formattedOriginalPrice}
              </span>
            )}
            {hasDiscount && (
              <span className="text-green-600 dark:text-green-400 text-sm font-semibold">
                -{discount}%
              </span>
            )}
          </div>

          {/* Rating Section */}
          <div className="flex items-center gap-1">
            {Array(5)
              .fill()
              .map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < filledStars
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-1">
              ({reviews})
            </span>
          </div>
        </div>
      </Link>
      
      {/* Action Buttons */}
      {!hideActions && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent flex justify-between">
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded transition-colors"
            aria-label="Add to cart"
          >
            <FaShoppingCart size={12} /> 
            <span>Add to Cart</span>
          </button>
          
          <button 
            onClick={handleWishlistToggle}
            className={`flex items-center justify-center gap-1 ${isInWishlist ? 'bg-pink-600' : 'bg-gray-600'} hover:bg-pink-700 text-white text-xs font-bold py-1 px-2 rounded transition-colors`}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <FaHeart size={12} /> 
            <span>{isInWishlist ? 'Wishlisted' : 'Wishlist'}</span>
          </button>
        </div>
      )}
      
      {/* Feedback Messages */}
      {showFeedback.cart && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-md shadow-lg animate-fade-in-out text-xs">
          Added to cart!
        </div>
      )}
      
      {showFeedback.wishlist && (
        <div className="absolute top-2 right-2 bg-pink-500 text-white px-2 py-1 rounded-md shadow-lg animate-fade-in-out text-xs">
          {isInWishlist ? 'Added to wishlist!' : 'Removed from wishlist!'}
        </div>
      )}
    </div>
  );
};

export default ProductCard;