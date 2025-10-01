import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Carousel from "../components/Carousel";
import carouselData from "../data/carouselData";
import CategoryGrid from "../components/CategoryGrid";
import OptimizedProductSection from "../components/OptimizedProductSection";
import ErrorBoundary from "../components/ErrorBoundary";
import { useCategories, useCompanies } from "../hooks/useApi";
import apiService from "../services/api";

const carProducts = [
  {
    id: 1,
    name: "Sport Coupe",
    price: 41399,
    originalPrice: 45999,
    discount: 10,
    rating: 4.6,
    reviews: 245,
    image:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 2,
    name: "Luxury Sedan",
    price: 44624,
    originalPrice: 52499,
    discount: 15,
    rating: 4.8,
    reviews: 310,
    image:
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 3,
    name: "Electric SUV",
    price: 54159,
    originalPrice: 61999,
    discount: 12,
    rating: 4.7,
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 4,
    name: "Compact Hatchback",
    price: 22079,
    originalPrice: 23999,
    discount: 8,
    rating: 4.3,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 5,
    name: "Off-Road Truck",
    price: 47199,
    originalPrice: 58999,
    discount: 20,
    rating: 4.5,
    reviews: 152,
    image:
      "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
  {
    id: 6,
    name: "Convertible Roadster",
    price: 59859,
    originalPrice: 72999,
    discount: 18,
    rating: 4.9,
    reviews: 278,
    image:
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  },
];


const Home = () => {
  // Only fetch categories and companies (not all products)
  const { data: categories, loading: categoriesLoading } = useCategories();
  const { data: companies, loading: companiesLoading } = useCompanies();
  
  // Carousel loading state
  const [carouselLoading, setCarouselLoading] = useState(true);
  
  useEffect(() => {
    const carouselTimer = setTimeout(() => {
      setCarouselLoading(false);
    }, 800);
    return () => clearTimeout(carouselTimer);
  }, []);

  // Lazy fetch functions for each section
  const fetchTrendingProducts = async () => {
    try {
      const response = await apiService.getAllProducts();
      console.log('Trending Products Response:', response);
      const products = response?.message || response?.data || [];
      console.log('Trending Products Count:', products.length);
      // Sort by rating and return all products (will be limited by component)
      const sorted = products.sort((a, b) => (b?.rating || 0) - (a?.rating || 0));
      return sorted;
    } catch (error) {
      console.error('Error fetching trending products:', error);
      return [];
    }
  };

  const fetchSaleProducts = async () => {
    try {
      const response = await apiService.getAllProducts();
      console.log('Sale Products Response:', response);
      const products = response?.message || response?.data || [];
      // Filter sale items and randomize
      const saleItems = products.filter(p => p?.salePrice && p?.currentPrice && p.salePrice < p.currentPrice);
      console.log('Sale Products Count:', saleItems.length);
      return shuffleArray(saleItems);
    } catch (error) {
      console.error('Error fetching sale products:', error);
      return [];
    }
  };

  const fetchNewArrivals = async () => {
    try {
      const response = await apiService.getAllProducts();
      console.log('New Arrivals Response:', response);
      const products = response?.message || response?.data || [];
      console.log('New Arrivals Count:', products.length);
      // Randomize to simulate new arrivals
      return shuffleArray(products);
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      return [];
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const response = await apiService.getAllProducts();
      console.log('Featured Products Response:', response);
      const products = response?.message || response?.data || [];
      console.log('Featured Products Count:', products.length);
      // Get all products (will be limited by component)
      return products;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  };

  // Utility function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  return (
    <Layout>
      {/* Carousel Section */}
      <div className="mt-6 mb-8 container mx-auto px-2 sm:px-4">
        <Carousel slides={carouselData} isLoading={carouselLoading} />
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-2 sm:px-4 mb-8">
        <h1 className="text-3xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100">
          Welcome to CrazyCars
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Discover premium auto parts and accessories
        </p>
      </div>
      
      {/* Category Grid */}
      <CategoryGrid 
        categories={categories?.data || []} 
        title="Car Categories" 
        isLoading={categoriesLoading} 
      />
      
      {/* Companies Section */}
      <CategoryGrid 
        categories={companies?.data || []} 
        title="Companies" 
        isCompany={true} 
        isLoading={companiesLoading} 
      />

      {/* Featured Products - Lazy Loaded */}
      <ErrorBoundary>
        <OptimizedProductSection
          title="Featured Products"
          fetchFunction={fetchFeaturedProducts}
          limit={8}
          randomize={false}
          showViewAll={true}
          viewAllLink="/shop"
        />
      </ErrorBoundary>

      {/* Sale Section - Lazy Loaded & Randomized */}
      <ErrorBoundary>
        <OptimizedProductSection
          title="🔥 Hot Deals"
          fetchFunction={fetchSaleProducts}
          limit={8}
          randomize={true}
          showViewAll={true}
          viewAllLink="/shop?filter=sale"
          className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900"
        />
      </ErrorBoundary>

      {/* Trending Products - Lazy Loaded */}
      <ErrorBoundary>
        <OptimizedProductSection
          title="⭐ Trending Now"
          fetchFunction={fetchTrendingProducts}
          limit={8}
          randomize={false}
          showViewAll={true}
          viewAllLink="/shop?filter=trending"
        />
      </ErrorBoundary>

      {/* New Arrivals - Lazy Loaded & Randomized */}
      <ErrorBoundary>
        <OptimizedProductSection
          title="✨ New Arrivals"
          fetchFunction={fetchNewArrivals}
          limit={8}
          randomize={true}
          showViewAll={true}
          viewAllLink="/shop?filter=new"
          className="bg-blue-50 dark:bg-gray-800"
        />
      </ErrorBoundary>
    </Layout>
  );
};

export default Home;
