import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  error,
  helperText,
  required = false,
  disabled = false,
  searchable = false,
  multiple = false,
  className = '',
  containerClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get display value
  const getDisplayValue = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      const selectedLabels = options
        .filter(opt => value.includes(opt.value))
        .map(opt => opt.label);
      return selectedLabels.length > 2
        ? `${selectedLabels.slice(0, 2).join(', ')}... (+${selectedLabels.length - 2})`
        : selectedLabels.join(', ');
    } else {
      const selected = options.find(opt => opt.value === value);
      return selected ? selected.label : placeholder;
    }
  };

  // Handle option selection
  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value?.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...(value || []), optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  // Check if option is selected
  const isSelected = (optionValue) => {
    return multiple ? value?.includes(optionValue) : value === optionValue;
  };

  const baseStyles = 'w-full px-4 py-2.5 text-sm bg-white dark:bg-gray-700 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2';
  const normalStyles = 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-primary-500/20';
  const errorStyles = 'border-red-500 dark:border-red-500 text-gray-900 dark:text-gray-100 focus:border-red-500 focus:ring-red-500/20';
  const disabledStyles = 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800';

  return (
    <div className={containerClassName} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            ${baseStyles}
            ${error ? errorStyles : normalStyles}
            ${disabled ? disabledStyles : 'cursor-pointer hover:border-gray-400 dark:hover:border-gray-500'}
            ${className}
            flex items-center justify-between
          `}
        >
          <span className={!value || (multiple && value.length === 0) ? 'text-gray-400' : ''}>
            {getDisplayValue()}
          </span>
          <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search..."
                      className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )}

              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      className={`
                        w-full px-4 py-2.5 text-sm text-left flex items-center justify-between
                        transition-colors duration-150
                        ${isSelected(option.value)
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon && <option.icon size={16} />}
                        <span>{option.label}</span>
                      </div>
                      {isSelected(option.value) && (
                        <Check size={16} className="text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400">
                    No options found
                  </div>
                )}
              </div>

              {multiple && value && value.length > 0 && (
                <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="w-full px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                  >
                    Clear selection
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
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

export default Select;
