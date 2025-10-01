import React, { useState, useEffect } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SkeletonLoader from './SkeletonLoader';

const ProductSection = ({ products, title, showSaleTag = false, bgColor = "bg-white", borderColor = "border-gray-200", loading = false }) => {
  // Don't render if loading or no products
  if (loading || !products || products.length === 0) {
    return (
      <div className={`py-8 ${bgColor} border-t ${borderColor}`}>
        <div className="container mx-auto px-2 sm:px-4">
          <h2 className="text-2xl font-bold mb-6 text-left text-gray-900 dark:text-gray-100">{title}</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array(5).fill().map((_, index) => (
                <SkeletonLoader key={index} type="product" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No products available</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 ${bgColor} border-t ${borderColor}`}>
      <div className="container mx-auto px-2 sm:px-4">
        <h2 className="text-2xl font-bold mb-6 text-left text-gray-900 dark:text-gray-100">{title}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
            <ProductCard 
              key={product._id || product.id} 
              product={product} 
              showSaleTag={showSaleTag}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, showSaleTag }) => {
  const {
    _id: id,
    title: name = "Unnamed Product",
    currentPrice: originalPrice = 0,
    salePrice,
    images,
    rating = 0,
    reviews = 0,
    price = salePrice || originalPrice,
  } = product;

  // Calculate discounted price
  const hasDiscount = salePrice > 0 && salePrice < originalPrice;
  const discountedPrice = hasDiscount ? salePrice : originalPrice;
  const discount = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  const formattedPrice = discountedPrice?.toLocaleString("en-IN") || "0";
  const formattedOriginalPrice = hasDiscount && originalPrice ? originalPrice.toLocaleString("en-IN") : null;
  const filledStars = Math.round(rating);
  
  // Debug click handler
  const handleClick = () => {
    console.log("Product clicked from ProductSection:", product);
  };

  return (
    <Link 
      to={`/product/${id}`}
      className="block w-full"
      onClick={handleClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg w-full">
        {/* Product Image */}
        <div className="relative w-full h-56">
          <img
            src={images?.[0] || "https://picsum.photos/400/300?random=car"}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://picsum.photos/400/300?random=fallback";
            }}
          />
          {showSaleTag && discount > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              SALE
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3 text-left">
          <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1 line-clamp-2">
            {name}
          </h3>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-bold text-red-500 dark:text-red-400">
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

        <div className="flex items-center gap-1">
            {Array(5)
              .fill()
              .map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < filledStars ? "text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 ml-1">
              ({reviews})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductSection;