import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// User Pages
import Home from './pages/Home'
import ShopPage from './pages/ShopPage'
import CartPage from './pages/CartPage'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfilePage from './pages/ProfilePage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccess from './pages/OrderSuccess'
import ProductDetails from './pages/ProductDetails'
import Wishlist from './pages/Wishlist'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import CategoryPage from './pages/CategoryPage'
import CategoriesPage from './pages/CategoriesPage'
import CompaniesPage from './pages/CompaniesPage'

// Admin App
import AdminApp from './admin/AdminApp'

import './App.css'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Admin Routes - All routes under /admin/* */}
        <Route path="/admin/*" element={<AdminApp />} />
        
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<div className="p-10 bg-white dark:bg-gray-900 min-h-screen"><h1 className="text-2xl text-gray-900 dark:text-gray-100">My Orders</h1><p className="text-gray-600 dark:text-gray-400">Your order history will appear here.</p></div>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/products/:category" element={<CategoryPage />} />
        <Route path="/forgot-password" element={<div className="p-10 bg-white dark:bg-gray-900 min-h-screen"><h1 className="text-2xl text-gray-900 dark:text-gray-100">Forgot Password</h1><p className="text-gray-600 dark:text-gray-400">Password reset functionality will be implemented later.</p></div>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success" element={<OrderSuccess />} />
      </Routes>
    </>
  )
}

export default App
