import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import SkeletonLoader from "./SkeletonLoader";
import products from "../data/products";

const ProductList = () => {
  const [loading, setLoading] = useState(true);
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    // Increased loading time to 5000ms to better verify skeleton loader functionality
    console.log('Loading products...');
    const timer = setTimeout(() => {
      const validProducts = products.filter(
        (p) => p && typeof p.originalPrice === "number"
      );
      console.log('Products loaded:', validProducts.length);
      setDisplayProducts(validProducts);
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mx-auto px-2 sm:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {loading
          ? <SkeletonLoader type="product" count={8} />
          : displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
      </div>
    </div>
  );
};

export default ProductList;
