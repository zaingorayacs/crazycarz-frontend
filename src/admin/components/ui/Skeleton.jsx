import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ 
  className = '', 
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  rounded = 'md'
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';
  
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-10 w-10 rounded-full',
    thumbnail: 'h-20 w-20 rounded-lg',
    card: 'h-32 w-full rounded-xl',
    button: 'h-10 w-24 rounded-lg',
    input: 'h-10 w-full rounded-lg',
    badge: 'h-6 w-16 rounded-full',
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'skeleton',
    none: '',
  };
  
  const style = {
    width: width || undefined,
    height: height || undefined,
  };
  
  return (
    <div
      className={`
        ${baseClasses}
        ${variants[variant] || ''}
        ${roundedClasses[rounded]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
    />
  );
};

// Skeleton Container for grouping multiple skeletons
const SkeletonContainer = ({ children, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {children}
    </div>
  );
};

// Skeleton Card Component
const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      <SkeletonContainer>
        <div className="flex items-center gap-4">
          <Skeleton variant="avatar" />
          <div className="flex-1 space-y-2">
            <Skeleton variant="title" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
        <Skeleton variant="text" />
        <Skeleton variant="text" width="80%" />
        <div className="flex gap-2 mt-4">
          <Skeleton variant="button" />
          <Skeleton variant="button" />
        </div>
      </SkeletonContainer>
    </div>
  );
};

// Skeleton Table Component
const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" width="60%" />
          ))}
        </div>
      </div>
      
      {/* Body */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton 
                  key={colIndex} 
                  variant="text" 
                  width={colIndex === 0 ? "80%" : "60%"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton Dashboard Component
const SkeletonDashboard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton variant="title" width="200px" />
          <Skeleton variant="text" width="300px" />
        </div>
        <Skeleton variant="button" width="100px" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <SkeletonCard />
          </motion.div>
        ))}
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="space-y-4">
              <Skeleton variant="title" width="150px" />
              <Skeleton variant="text" width="200px" />
              <Skeleton height="250px" className="rounded-lg" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Export all components
Skeleton.Container = SkeletonContainer;
Skeleton.Card = SkeletonCard;
Skeleton.Table = SkeletonTable;
Skeleton.Dashboard = SkeletonDashboard;

export default Skeleton;
