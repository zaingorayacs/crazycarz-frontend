import React, { useState, useMemo, useEffect } from "react";
import { Search, Download, Plus, Package, Filter, RefreshCw, Edit, Trash2, Eye, MoreVertical } from "lucide-react";
import axiosInstance from '../utils/axiosInstance';
import Loader from './Loader';
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Table from './ui/Table';
import Button from './ui/Button';
import Badge from './ui/Badge';
import Select from './ui/Select';
import Skeleton from './ui/Skeleton';

function ProductsListAdmin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();
  const { tenantId } = useParams();

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/admin/${tenantId}/products`);
      const data = response.data.data || [];
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchProducts();
    }
  }, [tenantId]);

  // Refresh products
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProducts();
    setTimeout(() => setIsRefreshing(false), 500);
  };


  // Unique categories for dropdown
  const uniqueCategories = useMemo(() => {
    const categories = products
      .map(p => p.category?.name)
      .filter(Boolean);
    return [...new Set(categories)];
  }, [products]);

  // Category options for Select component
  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...uniqueCategories.map(cat => ({ value: cat, label: cat }))
  ];

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else if (sortConfig.direction === 'desc') direction = null;
    }
    setSortConfig({ key: direction ? key : null, direction });
  };

  // Filtered and sorted products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const categoryMatch = selectedCategory === 'All' || product.category?.name === selectedCategory;
      const searchMatch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'category') {
          aValue = a.category?.name || '';
          bValue = b.category?.name || '';
        } else if (sortConfig.key === 'company') {
          aValue = a.company?.name || '';
          bValue = b.company?.name || '';
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortConfig]);

  // Pagination
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  if (loading) return <Skeleton.Table rows={8} columns={7} />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25">
              <Package className="h-6 w-6" />
            </div>
            Products Management
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Manage your product inventory and details
          </p>
        </motion.div>
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <Button
            variant="ghost"
            size="sm"
            icon={RefreshCw}
            onClick={handleRefresh}
            isLoading={isRefreshing}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate(`/admin/${tenantId}/products/add`)}
          >
            Add Product
          </Button>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Table.Search
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products by name or description..."
          className="flex-1"
        />
        <Select
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value)}
          options={categoryOptions}
          placeholder="Select category"
          className="w-full sm:w-64"
        />
        <Button
          variant="outline"
          size="sm"
          icon={Download}
        >
          Export
        </Button>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Table className="border-0 shadow-lg">
          <Table.Header>
            <Table.Row>
              <Table.Head>Product</Table.Head>
              <Table.Head 
                sortable 
                sorted={sortConfig.key === 'category' ? sortConfig.direction : null}
                onSort={() => handleSort('category')}
              >
                Category
              </Table.Head>
              <Table.Head
                sortable
                sorted={sortConfig.key === 'company' ? sortConfig.direction : null}
                onSort={() => handleSort('company')}
              >
                Company
              </Table.Head>
              <Table.Head
                sortable
                sorted={sortConfig.key === 'currentPrice' ? sortConfig.direction : null}
                onSort={() => handleSort('currentPrice')}
                align="right"
              >
                Price
              </Table.Head>
              <Table.Head align="right">Sale Price</Table.Head>
              <Table.Head
                sortable
                sorted={sortConfig.key === 'inStock' ? sortConfig.direction : null}
                onSort={() => handleSort('inStock')}
                align="center"
              >
                Stock
              </Table.Head>
              <Table.Head align="center">Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product, index) => (
                <motion.tr
                  key={product._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                        <img 
                          src={product.images[0]} 
                          alt={product.title} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {product.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {product.shortDescription}
                        </p>
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge variant="secondary" size="sm">
                      {product.category?.name || 'Uncategorized'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {product.company?.name || 'N/A'}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${product.currentPrice}
                    </span>
                  </Table.Cell>
                  <Table.Cell align="right">
                    {product.salePrice > 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">
                        ${product.salePrice}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </Table.Cell>
                  <Table.Cell align="center">
                    <Badge 
                      variant={product.inStock > 10 ? 'success' : product.inStock > 0 ? 'warning' : 'danger'}
                      size="sm"
                      className="min-w-[80px]"
                    >
                      {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell align="center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/${tenantId}/products/${product._id}`);
                        }}
                        className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/${tenantId}/products/${product._id}/edit`);
                        }}
                        className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        title="Edit Product"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete
                        }}
                        className="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Table.Cell>
                </motion.tr>
              ))
            ) : (
              <Table.Empty 
                message="No products found"
                icon={Package}
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => navigate(`/admin/${tenantId}/products/add`)}
                  >
                    Add Your First Product
                  </Button>
                }
              />
            )}
          </Table.Body>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <Table.Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAndSortedProducts.length}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

export default ProductsListAdmin;
