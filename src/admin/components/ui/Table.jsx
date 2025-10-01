import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Filter } from 'lucide-react';

// Main Table Component
const Table = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm ${className}`}>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  );
};

// Table Header
const TableHeader = ({ children, className = '' }) => {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </thead>
  );
};

// Table Body
const TableBody = ({ children, className = '' }) => {
  return (
    <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
      {children}
    </tbody>
  );
};

// Table Row
const TableRow = ({ children, className = '', onClick, hoverable = true }) => {
  const hoverClass = hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <tr 
      className={`${hoverClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

// Table Head Cell with Sorting
const TableHead = ({ 
  children, 
  sortable = false, 
  sorted = null, // 'asc', 'desc', or null
  onSort,
  align = 'left',
  className = '' 
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];
  
  const handleSort = () => {
    if (!sortable || !onSort) return;
    
    if (sorted === null) onSort('asc');
    else if (sorted === 'asc') onSort('desc');
    else onSort(null);
  };
  
  return (
    <th 
      className={`
        px-6 py-3.5 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider
        ${alignClass}
        ${sortable ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-gray-200' : ''}
        ${className}
      `}
      onClick={handleSort}
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="inline-flex">
            {sorted === null && <ChevronsUpDown size={14} className="text-gray-400" />}
            {sorted === 'asc' && <ChevronUp size={14} className="text-primary-600" />}
            {sorted === 'desc' && <ChevronDown size={14} className="text-primary-600" />}
          </span>
        )}
      </div>
    </th>
  );
};

// Table Cell
const TableCell = ({ 
  children, 
  align = 'left',
  className = '' 
}) => {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }[align];
  
  return (
    <td className={`px-6 py-4 text-sm text-gray-900 dark:text-gray-100 ${alignClass} ${className}`}>
      {children}
    </td>
  );
};

// Table Search Bar
const TableSearch = ({ 
  value, 
  onChange, 
  placeholder = 'Search...',
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={18} className="text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-200"
      />
    </div>
  );
};

// Table Pagination
const TablePagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  totalItems,
  className = '' 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  
  return (
    <div className={`flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`
              px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150
              ${currentPage === number 
                ? 'bg-primary-600 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }
            `}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Empty State
const TableEmpty = ({ 
  message = 'No data available',
  icon: Icon,
  action,
  className = '' 
}) => {
  return (
    <tr>
      <td colSpan="100%" className="px-6 py-12">
        <div className={`flex flex-col items-center justify-center text-center ${className}`}>
          {Icon && (
            <Icon size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
          )}
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            {message}
          </p>
          {action && (
            <div className="mt-4">
              {action}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Export components
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Search = TableSearch;
Table.Pagination = TablePagination;
Table.Empty = TableEmpty;

export default Table;
