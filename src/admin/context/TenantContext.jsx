import React, { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

const TenantContext = createContext();

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

export const TenantProvider = ({ children }) => {
  const { tenantId } = useParams();
  
  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const userTenantId = adminData.tenantId || tenantId;
  
  const value = {
    tenantId: tenantId || userTenantId,
    userTenantId,
  };
  
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
