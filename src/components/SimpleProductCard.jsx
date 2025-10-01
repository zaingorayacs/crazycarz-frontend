import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const SimpleProductCard = ({ product }) => {
  if (!product) {
    console.warn("SimpleProductCard rendered with a null or undefined product.");
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
  } = product;

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
  
  // Debug click handler
  const handleClick = () => {
    console.log("Product clicked:", product);
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
            src={images?.[0] || image || "https://picsum.photos/400/300?random=car"}
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

export default SimpleProductCard;
