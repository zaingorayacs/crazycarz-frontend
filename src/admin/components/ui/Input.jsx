import React from 'react';
import { AlertCircle } from 'lucide-react';

const Input = ({ 
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  required = false,
  ...props 
}) => {
  const baseStyles = 'w-full px-4 py-2.5 text-sm bg-white dark:bg-gray-700 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';
  const normalStyles = 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500/20';
  const errorStyles = 'border-red-500 dark:border-red-500 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500/20';
  
  return (
    <div className={`${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Icon size={18} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        <input
          className={`
            ${baseStyles}
            ${error ? errorStyles : normalStyles}
            ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${className}
          `}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Icon size={18} className="text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        {error && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <AlertCircle size={18} className="text-red-500" />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
