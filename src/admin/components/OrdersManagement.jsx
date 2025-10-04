import React, { useState, useRef, useEffect } from 'react';
import { Package2, Loader2 } from 'lucide-react';
import { useParams } from 'react-router-dom';
import Loader from './Loader';
import axiosInstance from '../utils/axiosInstance';

const OrderManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [batchOrderStatus, setBatchOrderStatus] = useState('');
  const [batchPaymentStatus, setBatchPaymentStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  // ✅ Filters
  const [filterOrderStatus, setFilterOrderStatus] = useState('');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('');
  
  // ✅ Refs for synchronized scrolling
  const topScrollRef = useRef(null);
  const tableScrollRef = useRef(null);

  // ✅ Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/orders');
        console.log('Orders data:', res.data?.data); // Debug log
        console.log('First order:', res.data?.data[0]); // Debug first order
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // ✅ Synchronized scrolling between top scrollbar and table
  useEffect(() => {
    const topScroll = topScrollRef.current;
    const tableScroll = tableScrollRef.current;

    if (!topScroll || !tableScroll) return;

    // Sync the width of top scrollbar with table
    const syncWidth = () => {
      const table = tableScroll.querySelector('table');
      if (table) {
        const scrollbarContent = topScroll.querySelector('div');
        if (scrollbarContent) {
          scrollbarContent.style.width = `${table.scrollWidth}px`;
        }
      }
    };

    syncWidth();
    window.addEventListener('resize', syncWidth);

    const handleTopScroll = () => {
      tableScroll.scrollLeft = topScroll.scrollLeft;
    };

    const handleTableScroll = () => {
      topScroll.scrollLeft = tableScroll.scrollLeft;
    };

    topScroll.addEventListener('scroll', handleTopScroll);
    tableScroll.addEventListener('scroll', handleTableScroll);

    return () => {
      window.removeEventListener('resize', syncWidth);
      topScroll.removeEventListener('scroll', handleTopScroll);
      tableScroll.removeEventListener('scroll', handleTableScroll);
    };
  }, [loading, products]);

  // ✅ Individual status change
  const handleOrderStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch('/admin/orders/status', {
        orderId: id,
        orderStatus: newStatus,
      });
      setProducts(products.map(order =>
        order._id === id ? { ...order, orderStatus: res.data.data.orderStatus } : order
      ));
    } catch (err) {
      console.error("Failed to update order status:", err.response?.data || err);
    }
  };

  const handlePaymentStatusChange = async (id, newStatus) => {
    try {
      const res = await axiosInstance.patch('/admin/orders/status', {
        orderId: id,
        paymentStatus: newStatus,
      });
      setProducts(products.map(order =>
        order._id === id ? { ...order, paymentStatus: res.data.data.paymentStatus } : order
      ));
    } catch (err) {
      console.error("Failed to update payment status:", err.response?.data || err);
    }
  };

  // ✅ Batch update both
  const handleBatchUpdate = async () => {
    if (!batchOrderStatus && !batchPaymentStatus) return;
    if (selectedOrders.length === 0) return;

    setUpdating(true);
    try {
      await Promise.all(
        selectedOrders.map(id =>
          axiosInstance.patch('/admin/orders/status', {
            orderId: id,
            ...(batchOrderStatus && { orderStatus: batchOrderStatus }),
            ...(batchPaymentStatus && { paymentStatus: batchPaymentStatus }),
          })
        )
      );

      setProducts(products.map(order =>
        selectedOrders.includes(order._id)
          ? {
              ...order,
              ...(batchOrderStatus && { orderStatus: batchOrderStatus }),
              ...(batchPaymentStatus && { paymentStatus: batchPaymentStatus }),
            }
          : order
      ));
      setSelectedOrders([]);
      setBatchOrderStatus('');
      setBatchPaymentStatus('');
    } catch (err) {
      console.error("Batch update failed:", err.response?.data || err);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Status colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Shipped': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  // ✅ Checkbox helpers
  const toggleSelectAll = () => {
    if (selectedOrders.length === products.length) setSelectedOrders([]);
    else setSelectedOrders(products.map(o => o._id));
  };

  const toggleSelectOne = (id) => {
    setSelectedOrders(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // ✅ Apply filters
  const filteredProducts = products.filter(order => {
    const matchOrder = filterOrderStatus ? order.orderStatus === filterOrderStatus : true;
    const matchPayment = filterPaymentStatus ? order.paymentStatus === filterPaymentStatus : true;
    return matchOrder && matchPayment;
  });

  return (
    <div className='bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 font-sans text-gray-900 dark:text-gray-100'>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-x-2">
          <Package2 className="h-7 w-7 text-blue-500" />
          Order Management
        </h1>

        {/* ✅ Batch action controls */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={batchOrderStatus}
            onChange={(e) => setBatchOrderStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">-- Order Status --</option>
            <option value='Processing'>Processing</option>
            <option value='Confirmed'>Confirmed</option>
            <option value='Shipped'>Shipped</option>
            <option value='Delivered'>Delivered</option>
            <option value='Cancelled'>Cancelled</option>
          </select>

          <select
            value={batchPaymentStatus}
            onChange={(e) => setBatchPaymentStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">-- Payment Status --</option>
            <option value='Paid'>Paid</option>
            <option value='Pending'>Pending</option>
            <option value='Refunded'>Refunded</option>
          </select>

          <button
            onClick={handleBatchUpdate}
            disabled={selectedOrders.length === 0 || updating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 shadow-md transition"
          >
            {updating ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              <span>Update Selected</span>
            )}
          </button>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={filterOrderStatus}
          onChange={(e) => setFilterOrderStatus(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">-- Filter by Order Status --</option>
          <option value='Processing'>Processing</option>
          <option value='Confirmed'>Confirmed</option>
          <option value='Shipped'>Shipped</option>
          <option value='Delivered'>Delivered</option>
          <option value='Cancelled'>Cancelled</option>
        </select>

        <select
          value={filterPaymentStatus}
          onChange={(e) => setFilterPaymentStatus(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">-- Filter by Payment Status --</option>
          <option value='Paid'>Paid</option>
          <option value='Pending'>Pending</option>
          <option value='Refunded'>Refunded</option>
        </select>
      </div>

      <div className='relative shadow-md sm:rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'>
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader />
          </div>
        ) : (
          <>
            {/* Top Scrollbar */}
            <div 
              ref={topScrollRef}
              className="overflow-x-auto custom-scrollbar sticky top-0 z-10 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600"
              style={{ height: '12px' }}
            >
              <div style={{ width: 'max-content', height: '1px' }}>
                {/* This div forces the scrollbar to appear with the same width as the table */}
              </div>
            </div>
            
            {/* Table Container */}
            <div ref={tableScrollRef} className="overflow-x-auto custom-scrollbar">
              <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
            <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th className='px-4 py-3'>
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === products.length && products.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th scope='col' className='px-6 py-3'>Product</th>
                <th scope='col' className='px-6 py-3'>Customer Name</th>   
                <th scope='col' className='px-6 py-3'>Customer Email</th>  
                <th scope='col' className='px-6 py-3'>Price</th>
                <th scope='col' className='px-6 py-3'>In Stock</th>
                <th scope='col' className='px-6 py-3'>Quantity</th>        
                <th scope='col' className='px-6 py-3'>Total Price</th>     
                <th scope='col' className='px-6 py-3'>Order Status</th>
                <th scope='col' className='px-6 py-3'>Change Order Status</th>
                <th scope='col' className='px-6 py-3'>Advance Payment Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((order) => {
                  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
                  const totalPrice = order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);

                  return (
                    <tr key={order._id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                      <td className='px-4 py-3'>
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order._id)}
                          onChange={() => toggleSelectOne(order._id)}
                        />
                      </td>
                      <th scope='row' className='flex items-center px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'>
                        <img className='w-10 h-10 rounded-full mr-3' src={order.items[0].productId?.images?.[0]} alt={`${order.items[0].productId?.title} image`} />
                        <div>
                          <div className='text-base font-semibold'>{order.items[0].productId?.title}</div>
                          <div className='font-normal text-gray-500 dark:text-gray-400'>{order.items[0].productId?.shortDescription}</div>
                        </div>
                      </th>
                      <td className='px-6 py-4'>
                        {(() => {
                          console.log('Order shipping address:', order.shippingAddress);
                          console.log('Order userId:', order.userId);
                          
                          // Try different name field combinations
                          if (order.shippingAddress?.firstName || order.shippingAddress?.lastName) {
                            const first = order.shippingAddress.firstName || '';
                            const last = order.shippingAddress.lastName || '';
                            return `${first} ${last}`.trim() || "N/A";
                          } else if (order.shippingAddress?.fullName) {
                            return order.shippingAddress.fullName;
                          } else if (order.userId?.firstName) {
                            return `${order.userId.firstName} ${order.userId.lastName || ''}`.trim();
                          } else {
                            return "N/A";
                          }
                        })()}
                      </td>
                      <td className='px-6 py-4'>
                        {order.shippingAddress?.email || order.userId?.email || "N/A"}
                      </td>
                      <td className='px-6 py-4'>${order.items[0].productId?.currentPrice}</td>
                      <td className='px-6 py-4'>
                        <div className='flex items-center'>
                          <div className={`h-2.5 w-2.5 rounded-full ${order.items[0].productId?.inStock > 0 ? 'bg-green-500' : 'bg-red-500'} me-2`}></div>
                          {order.items[0].inStock > 0 ? 'Available' : 'Out of Stock'} ({order.items[0].productId?.inStock})
                        </div>
                      </td>
                      <td className='px-6 py-4'>{totalQuantity}</td>
                      <td className='px-6 py-4'>${totalPrice}</td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleOrderStatusChange(order._id, e.target.value)}
                          className='max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        >
                          <option value='Processing'>Processing</option>
                          <option value='Confirmed'>Confirmed</option>
                          <option value='Shipped'>Shipped</option>
                          <option value='Delivered'>Delivered</option>
                          <option value='Cancelled'>Cancelled</option>
                        </select>
                      </td>
                      <td className='px-6 py-4'>
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => handlePaymentStatusChange(order._id, e.target.value)}
                          className='max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                        >
                          <option value='Paid'>Paid</option>
                          <option value='Pending'>Pending</option>
                          <option value='Refunded'>Refunded</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan='11' className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
