import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const OrderSuccess = () => {
  const { orderId: reduxOrderId } = useSelector(state => state.checkout);
  const [orderId, setOrderId] = useState(reduxOrderId);
  
  useEffect(() => {
    // Try to get order ID from localStorage if not in redux
    const lastOrderId = localStorage.getItem('lastOrderId');
    if (lastOrderId && !orderId) {
      setOrderId(lastOrderId);
    }
  }, [orderId]);

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900">
              <svg className="h-10 w-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Thank you for your order!</h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Your order has been placed successfully.
            {orderId && (
              <span className="block mt-2">
                Order ID: <span className="font-medium">{orderId}</span>
              </span>
            )}
          </p>
          
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            We've sent you an email with all the details of your order.
            You will receive another notification when your order ships.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              View Orders
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderSuccess;