import React from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Parse pathname to create breadcrumb items
  const pathnames = location.pathname.split('/').filter(x => x);
  
  // Remove 'admin' from breadcrumbs
  const filteredPathnames = pathnames.filter(path => path !== 'admin');
  
  // Create breadcrumb items with proper labels
  const getBreadcrumbLabel = (path) => {
    const labels = {
      'dashboard': 'Dashboard',
      'products': 'Products',
      'add': 'Add New',
      'orders': 'Orders',
      'confirmed': 'Confirmed Orders',
      'customers': 'Customers',
      'categories': 'Categories',
      'companies': 'Companies',
      'settings': 'Settings',
    };
    return labels[path] || path.charAt(0).toUpperCase() + path.slice(1);
  };
  
  const buildUrl = (index) => {
    const paths = ['admin', ...filteredPathnames.slice(0, index + 1)];
    return '/' + paths.filter(Boolean).join('/');
  };
  
  if (filteredPathnames.length === 0) return null;
  
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        to="/admin/dashboard"
        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
      >
        <Home size={16} />
      </Link>
      
      {filteredPathnames.map((path, index) => {
        const isLast = index === filteredPathnames.length - 1;
        const url = buildUrl(index);
        
        return (
          <React.Fragment key={path}>
            <ChevronRight size={16} className="text-gray-400 dark:text-gray-600" />
            {isLast ? (
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {getBreadcrumbLabel(path)}
              </span>
            ) : (
              <Link
                to={url}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {getBreadcrumbLabel(path)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
