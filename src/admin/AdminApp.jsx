import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store  from './store/store';

// Admin Components
import AdminSignin from './components/AdminSignin';
import AdminSignup from './components/AdminSignup';
import VerifyOTP from './components/VerifyOTP';
import Dashboard from './components/Dashboard';
import ProductsList from './components/ProductsList';
import AddProductForm from './components/AddProductForm';
import ProductDetails from './components/ProductDetails';
import OrdersManagement from './components/OrdersManagement';
import ConfirmedOrders from './components/ConfirmedOrders';
import Customers from './components/Customers';
import AddCategory from './components/AddCategory';
import AddCompany from './components/AddCompany';
import AdminSettings from './components/AdminSettings';
import SidebarImproved from './components/SidebarImproved';
import Header from './components/Header';
import Breadcrumbs from './components/Breadcrumbs';

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarImproved isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto w-full">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Protected Route Component with Tenant Validation
const ProtectedRoute = ({ children }) => {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('adminToken');
  
  useEffect(() => {
    if (isAuthenticated && tenantId) {
      // Validate tenant access
      const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
      const userTenantId = adminData.tenantId;
      
      if (userTenantId && userTenantId !== tenantId) {
        alert(`Access denied. You are not authorized to access tenant '${tenantId}'. Your tenant is '${userTenantId}'.`);
        navigate(`/admin/${userTenantId}/dashboard`, { replace: true });
      }
    }
  }, [isAuthenticated, tenantId, navigate]);
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/signin" replace />;
  }
  
  if (!tenantId) {
    // If no tenantId in URL, redirect to signin
    return <Navigate to="/admin/signin" replace />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

const AdminApp = () => {
  return (
    <Provider store={store}>
      <Routes>
        {/* Public Admin Routes */}
        <Route path="/signin" element={<AdminSignin />} />
        <Route path="/signup" element={<AdminSignup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        
        {/* Tenant-Aware Protected Admin Routes */}
        <Route path="/:tenantId/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/products" element={
          <ProtectedRoute>
            <ProductsList />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/products/add" element={
          <ProtectedRoute>
            <AddProductForm />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/products/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/orders" element={
          <ProtectedRoute>
            <OrdersManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/orders/confirmed" element={
          <ProtectedRoute>
            <ConfirmedOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/customers" element={
          <ProtectedRoute>
            <Customers />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/categories/add" element={
          <ProtectedRoute>
            <AddCategory />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/companies/add" element={
          <ProtectedRoute>
            <AddCompany />
          </ProtectedRoute>
        } />
        
        <Route path="/:tenantId/settings" element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        } />
        
        {/* Default redirect - will be handled by signin */}
        <Route path="/" element={<Navigate to="/admin/signin" replace />} />
        <Route path="*" element={<Navigate to="/admin/signin" replace />} />
      </Routes>
    </Provider>
  );
};

export default AdminApp;
