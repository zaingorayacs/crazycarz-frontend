import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  Plus,
  Tag,
  Building2,
  ChevronDown,
  ChevronRight,
  PackageCheck,
  X,
  Menu,
  LogOut,
  HelpCircle
} from "lucide-react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function SidebarImproved({ isOpen, onClose }) {
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed
  const [isHovered, setIsHovered] = useState(false);
  const { tenantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Determine if sidebar should be expanded
  const isExpanded = isHovered || !isCollapsed;
  
  const buildUrl = (path) => {
    if (!tenantId) return path;
    return `/admin/${tenantId}${path}`;
  };
  
  const isActive = (path) => {
    return location.pathname === buildUrl(path);
  };
  
  const isParentActive = (paths) => {
    return paths.some(path => location.pathname.includes(path));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminRefreshToken');
    navigate('/admin/signin');
  };
  
  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
    },
    {
      name: 'Products',
      icon: Package,
      path: '/products',
      hasDropdown: true,
      subItems: [
        { name: 'All Products', path: '/products', icon: Package },
        { name: 'Add Product', path: '/products/add', icon: Plus },
        { name: 'Add Category', path: '/categories/add', icon: Tag },
        { name: 'Add Company', path: '/companies/add', icon: Building2 },
      ]
    },
    {
      name: 'Orders',
      icon: ShoppingCart,
      path: '/orders',
    },
    {
      name: 'Confirmed Orders',
      icon: PackageCheck,
      path: '/orders/confirmed',
    },
    {
      name: 'Customers',
      icon: Users,
      path: '/customers',
    },
    {
      name: 'Settings',
      icon: Settings,
      path: '/settings',
    },
  ];
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isExpanded ? 256 : 80,
        }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed lg:sticky top-0 left-0 z-50 h-screen
          bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-900 dark:to-gray-950
          border-r border-gray-700/50
          flex flex-col
          shadow-2xl
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="relative p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              animate={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900 animate-pulse" />
              </div>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h1 className="font-bold text-lg text-white">
                      CrazyCars
                    </h1>
                    <p className="text-xs text-gray-400">
                      Admin Panel
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {menuItems.map((item, index) => (
            <motion.div 
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => setIsProductsDropdownOpen(!isProductsDropdownOpen)}
                    className={`
                      w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl
                      text-sm font-medium transition-all duration-200 group relative
                      ${isParentActive(['/products', '/categories', '/companies'])
                        ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 shadow-sm'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                      }
                    `}
                    title={!isExpanded ? item.name : undefined}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className="flex-shrink-0" />
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-left"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                    {isExpanded && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isProductsDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                    {isParentActive(['/products', '/categories', '/companies']) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full -ml-3"
                      />
                    )}
                  </button>
                  
                  {/* Dropdown Items */}
                  <AnimatePresence>
                    {isProductsDropdownOpen && isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-700 space-y-1">
                          {item.subItems.map((subItem, subIndex) => (
                            <motion.div
                              key={subItem.name}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: subIndex * 0.05 }}
                            >
                              <Link
                                to={buildUrl(subItem.path)}
                                onClick={onClose}
                                className={`
                                  flex items-center gap-3 px-3 py-2 rounded-lg
                                  text-sm font-medium transition-all duration-200
                                  ${isActive(subItem.path)
                                    ? 'bg-primary-500/10 text-primary-400'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                                  }
                                `}
                              >
                                <subItem.icon size={18} className="flex-shrink-0" />
                                <span>{subItem.name}</span>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to={buildUrl(item.path)}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl
                    text-sm font-medium transition-all duration-200 group relative
                    ${isActive(item.path)
                      ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-primary-400 shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }
                  `}
                  title={!isExpanded ? item.name : undefined}
                >
                  <item.icon size={20} className="flex-shrink-0" />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full -ml-3"
                    />
                  )}
                  {isActive(item.path) && isExpanded && (
                    <div className="ml-auto w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                  )}
                </Link>
              )}
            </motion.div>
          ))}
        </nav>
        
        {/* Footer */}
        <div className="p-3 space-y-2 border-t border-gray-700/50">
          {isExpanded && (
            <>
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors">
                <HelpCircle size={18} />
                <span>Help & Support</span>
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
          
          <div className={`${!isExpanded ? 'px-2' : 'px-3'} py-2 bg-gradient-to-r from-primary-900/20 to-primary-800/20 rounded-lg border border-primary-700/30`}>
            {isExpanded ? (
              <>
                <p className="text-xs font-medium text-primary-400">
                  Pro Tip
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Press ⌘K for quick search
                </p>
              </>
            ) : (
              <div className="flex justify-center">
                <HelpCircle size={16} className="text-primary-400" />
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default SidebarImproved;
