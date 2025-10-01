import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  ChevronDown,
  Search,
  Command,
  Activity,
  Shield
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onMenuClick }) => {
  const [isDark, setIsDark] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const { tenantId } = useParams();
  
  // Get admin data from localStorage
  const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
  const adminName = `${adminData.firstName || 'Admin'} ${adminData.lastName || ''}`.trim();
  const adminEmail = adminData.email || 'admin@example.com';
  
  // Mock notifications
  const notifications = [
    { id: 1, title: 'New order received', time: '5 min ago', unread: true },
    { id: 2, title: 'Product stock low', time: '1 hour ago', unread: true },
    { id: 3, title: 'Customer review posted', time: '2 hours ago', unread: false },
  ];
  
  const unreadCount = notifications.filter(n => n.unread).length;
  
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Theme toggle
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminRefreshToken');
    navigate('/admin/signin');
  };
  
  const buildUrl = (path) => {
    if (!tenantId) return path;
    return `/admin/${tenantId}${path}`;
  };
  
  return (
    <header className="sticky top-0 z-40 glass border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left: Mobile menu button and Search */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
          
          {/* Quick Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 hover:border-primary-500/50 transition-all duration-200 cursor-pointer group">
            <Search size={16} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Quick search...</span>
            <div className="flex items-center gap-1 ml-8">
              <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">⌘</kbd>
              <kbd className="px-1.5 py-0.5 text-xs bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">K</kbd>
            </div>
          </div>
          
          {/* Tenant badge */}
          {tenantId && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-primary-500/10 to-primary-600/10 rounded-xl border border-primary-500/20"
            >
              <Activity size={14} className="text-primary-500 animate-pulse" />
              <span className="text-sm font-medium text-primary-700 dark:text-primary-400">
                {tenantId}
              </span>
            </motion.div>
          )}
        </div>
        
        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 group"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: 90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={20} className="group-hover:text-yellow-500 transition-colors" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  exit={{ rotate: -90, scale: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={20} className="group-hover:text-blue-500 transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative p-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105 group"
              aria-label="Notifications"
            >
              <Bell size={20} className="group-hover:animate-bounce-slow" />
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1.5 right-1.5 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, type: "spring", damping: 25 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Notifications
                      </h3>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                  </div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <motion.button
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                              <Bell size={14} className="text-primary-600 dark:text-primary-400" />
                            </div>
                            {notification.unread && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                </div>
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                      View all notifications →
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
              aria-label="Profile menu"
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
                  {adminName.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {adminName}
                </p>
                <div className="flex items-center gap-1">
                  <Shield size={10} className="text-primary-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </p>
                </div>
              </div>
              <ChevronDown size={16} className={`text-gray-600 dark:text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2, type: "spring", damping: 25 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-primary-500/25">
                        {adminName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {adminName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {adminEmail}
                        </p>
                      </div>
                    </div>
                  </div>
                
                  <div className="py-2">
                    <button
                      onClick={() => {
                        navigate(buildUrl('/settings'));
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                    >
                      <Settings size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span>Settings</span>
                    </button>
                  </div>
                
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group"
                    >
                      <LogOut size={16} className="group-hover:translate-x-1 transition-transform" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
