import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Filter, ChevronDown, ChevronLeft, ChevronRight, Download, Plus, Trash2 } from 'lucide-react';
import Loader from './Loader';
import api from '../utils/axiosInstance.js'
// Mock data for customers
const customersData = [
  { id: 1, name: 'Alice Johnson', email: 'alice.johnson@example.com', status: 'Active', lastOrder: '2024-07-28', totalSpent: 1250.50 },
  { id: 2, name: 'Bob Smith', email: 'bob.smith@example.com', status: 'Active', lastOrder: '2024-07-25', totalSpent: 875.20 },
  { id: 3, name: 'Charlie Brown', email: 'charlie.brown@example.com', status: 'Inactive', lastOrder: '2024-05-15', totalSpent: 210.00 },
  { id: 4, name: 'Diana Prince', email: 'diana.prince@example.com', status: 'Active', lastOrder: '2024-08-02', totalSpent: 3450.99 },
  { id: 5, name: 'Edward Nygma', email: 'edward.nygma@example.com', status: 'Inactive', lastOrder: '2024-06-10', totalSpent: 55.75 },
  { id: 6, name: 'Fiona Glenanne', email: 'fiona.glenanne@example.com', status: 'Active', lastOrder: '2024-07-18', totalSpent: 199.99 },
  { id: 7, name: 'George Harrison', email: 'george.harrison@example.com', status: 'Active', lastOrder: '2024-08-03', totalSpent: 75.00 },
  { id: 8, name: 'Hannah Montana', email: 'hannah.montana@example.com', status: 'Active', lastOrder: '2024-08-01', totalSpent: 120.00 },
  { id: 9, name: 'Ian Malcom', email: 'ian.malcom@example.com', status: 'Inactive', lastOrder: '2024-04-22', totalSpent: 89.99 },
  { id: 10, name: 'Jessica Jones', email: 'jessica.jones@example.com', status: 'Active', lastOrder: '2024-08-04', totalSpent: 500.00 },
  { id: 11, name: 'Kyle Katarn', email: 'kyle.katarn@example.com', status: 'Active', lastOrder: '2024-08-04', totalSpent: 650.00 },
  { id: 12, name: 'Leia Organa', email: 'leia.organa@example.com', status: 'Active', lastOrder: '2024-08-01', totalSpent: 890.00 },
  { id: 13, name: 'Michael Scott', email: 'michael.scott@example.com', status: 'Inactive', lastOrder: '2024-03-10', totalSpent: 15.00 },
  { id: 14, name: 'Neo Anderson', email: 'neo.anderson@example.com', status: 'Active', lastOrder: '2024-07-30', totalSpent: 1500.00 },
  { id: 15, name: 'Oliver Queen', email: 'oliver.queen@example.com', status: 'Active', lastOrder: '2024-08-02', totalSpent: 250.00 },
];

function CustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDateRange, setFilterDateRange] = useState('All Time');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const today = new Date();
    let startDate;

    if (filterDateRange === 'This Week') {
      const dayOfWeek = today.getDay();
      startDate = new Date(today);
      startDate.setDate(today.getDate() - dayOfWeek);
    } else if (filterDateRange === 'This Month') {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (filterDateRange === 'This Year') {
      startDate = new Date(today.getFullYear(), 0, 1);
    }

    let filteredCustomers = customersData;

    // Apply search filter
    if (searchQuery) {
      filteredCustomers = filteredCustomers.filter(customer =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    if (filterDateRange !== 'All Time') {
      filteredCustomers = filteredCustomers.filter(customer => {
        const lastOrderDate = new Date(customer.lastOrder);
        return lastOrderDate >= startDate;
      });
    }

    setCustomers(filteredCustomers);
  }, [searchQuery, filterDateRange]);

  const handleFilterClick = (dateRange) => {
    setFilterDateRange(dateRange);
    setIsFilterDropdownOpen(false);
  };






   const [loading, setLoading] = useState(true);

  useEffect(() => {

    
      setLoading(true);
      const fetchCustomers = async () => {
        try {
        const response = await api.get('/auth/order-summary');
        console.log(response.data.data);
        
        setCustomers(response.data.data);
        setLoading(false);
      }
       catch (error) {
      console.error('Error fetching customers:', error);
    }
    finally{
      setLoading(false);
    }
  }
    fetchCustomers();
  }, []);


  return (
    


<>
  {loading ? (
        <Loader size={100} color="#3498db" />
      ) : (
        <div className='bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-gray-900 dark:text-gray-100'>
      <div className='max-w-7xl mx-auto w-full'>

        {/* Header Section */}
        <div className="text-gray-900 dark:text-gray-100 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-x-2">
            <User className="h-7 w-7 text-blue-500" />
            All Customers
          </h1>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>Manage your customer base, search, and filter by last order date.</p>
        </div>

        {/* Controls Section (Search & Filters) */}
        <div className='flex items-center gap-x-4 mb-4 relative flex-col sm:flex-row' ref={filterDropdownRef}>
          {/* Search Input */}
          <div className='relative w-full sm:w-auto flex-grow'>
            <input
              type='search'
              placeholder='Search by name or email...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full ps-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-colors'
            />
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' size={18} />
          </div>

          {/* Filter Dropdown Button */}
          <div className="relative w-full sm:w-auto">
            <button
              type='button'
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className={`w-full sm:w-auto flex items-center justify-center gap-x-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-md ${
                isFilterDropdownOpen
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown size={16} className={`transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Filters Dropdown */}
            {isFilterDropdownOpen && (
              <div className='absolute right-0 mt-2 w-56 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10'>
                <ul className='space-y-1'>
                  <li>
                    <button onClick={() => handleFilterClick('All Time')} className='w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'>All Time</button>
                  </li>
                  <li>
                    <button onClick={() => handleFilterClick('This Week')} className='w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'>This Week</button>
                  </li>
                  <li>
                    <button onClick={() => handleFilterClick('This Month')} className='w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'>This Month</button>
                  </li>
                  <li>
                    <button onClick={() => handleFilterClick('This Year')} className='w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700'>This Year</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customers Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 px-4 pb-3 pt-4 sm:px-6">
          <div className='w-full overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-700 border-y'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Customer Name
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Email
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Last Order
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Total Spent
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white'>
                        {customer.name}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {customer.email}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        {customer.lastOrder}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <div className="flex justify-end gap-2">
                          <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='5' className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'>
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action buttons and Pagination */}
        <div className='flex items-center justify-between mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700'>
          <div className='flex gap-2'>
            <button className='flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 transition-colors'>
              <Plus size={18} />
              Add New Customer
            </button>
            <button className='flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'>
              <Download size={18} />
              Export
            </button>
          </div>

          <div className='flex items-center gap-1'>
            <button className='flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'>
              <ChevronLeft size={18} />
            </button>
            <button className='flex items-center justify-center w-10 h-10 text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-colors'>
              1
            </button>
            <button className='flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'>
              2
            </button>
            <button className='flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'>
              3
            </button>
            <button className='flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-200 rounded-full shadow-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors'>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
      )}
</>
  );
}

export default CustomerTable;
