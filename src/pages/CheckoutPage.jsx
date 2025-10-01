import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { saveAddress, selectPaymentMethod, setOrderSummary, confirmOrder, setStep } from '../redux/checkoutSlice';
import { clearCart } from '../redux/slices/cartSlice';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStep, address, paymentMethod, paymentDetails } = useSelector(state => state.checkout);
  const { cartItems } = useSelector(state => state.cart) || { cartItems: [] };
  
  // Form states
  const [addressData, setAddressData] = useState(address);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethod || 'cash');
  const [paymentData, setPaymentData] = useState(paymentDetails || {});
  const [formErrors, setFormErrors] = useState({});
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  // Calculate totals
  const subtotal = cartItems?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
  const shipping = subtotal > 0 ? 10 : 0;
  const total = subtotal + shipping;
  
  useEffect(() => {
    // Redirect if cart is empty
    if (!cartItems?.length) {
      navigate('/cart');
    }
    
    // Set order summary in redux
    dispatch(setOrderSummary({ 
      subtotal, 
      shipping, 
      total, 
      items: cartItems?.length || 0 
    }));
  }, [cartItems, dispatch, navigate, subtotal, shipping, total]);
  
  const handleAddressChange = (e) => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
  };
  
  const handlePaymentMethodChange = (e) => {
    setSelectedPayment(e.target.value);
    setPaymentData({});
  };
  
  const handlePaymentDetailsChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };
  
  const validateAddressForm = () => {
    const errors = {};
    if (!addressData.fullName) errors.fullName = 'Full name is required';
    if (!addressData.email) errors.email = 'Email is required';
    if (!addressData.phone) errors.phone = 'Phone number is required';
    if (!addressData.address) errors.address = 'Address is required';
    if (!addressData.city) errors.city = 'City is required';
    if (!addressData.postalCode) errors.postalCode = 'Postal code is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePaymentForm = () => {
    const errors = {};
    
    if (selectedPayment === 'jazzcash') {
      if (!paymentData.mobileNumber) errors.mobileNumber = 'Mobile number is required';
    } else if (selectedPayment === 'easypaisa') {
      if (!paymentData.mobileNumber) errors.mobileNumber = 'Mobile number is required';
    } else if (selectedPayment === 'bank') {
      if (!paymentData.accountNumber) errors.accountNumber = 'Account number is required';
      if (!paymentData.bankName) errors.bankName = 'Bank name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (validateAddressForm()) {
      dispatch(saveAddress(addressData));
    }
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (validatePaymentForm()) {
      dispatch(selectPaymentMethod({ 
        method: selectedPayment, 
        details: paymentData 
      }));
    }
  };
  
  const handlePlaceOrder = async () => {
    try {
      setIsPlacingOrder(true);
      setFormErrors({});
      
      // Get user data from localStorage or auth state
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const userId = userData._id || null;
      
      // Parse fullName into firstName and lastName
      const nameParts = address.fullName?.trim().split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Prepare order data
      const orderData = {
        userId,
        items: cartItems.map(item => ({
          productId: item._id || item.id,
          quantity: item.quantity,
          price: item.price || item.salePrice || item.currentPrice
        })),
        totalAmount: total,
        firstName,
        lastName,
        email: address.email,
        phoneNumber: address.phone,
        addressLine: address.address,
        city: address.city,
        state: address.state || 'N/A',
        postalCode: address.postalCode,
        country: address.country || 'Pakistan',
        paymentMethod: paymentMethod === 'cash' ? 'COD' : paymentMethod === 'jazzcash' ? 'JazzCash' : 'Card',
      };
      
      console.log('Creating order:', orderData);
      
      // Create order via API
      const response = await axios.post(`${API_URL}/orders`, orderData);
      
      console.log('Order created:', response.data);
      
      // Store order ID for success page
      localStorage.setItem('lastOrderId', response.data.data.orderIdForCustomer);
      
      // Update Redux state
      dispatch(confirmOrder());
      dispatch(clearCart());
      
      // Navigate to success page
      navigate('/order-success');
      
    } catch (error) {
      console.error('Error creating order:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create order. Please try again.';
      setFormErrors({ submit: errorMessage });
      alert(errorMessage);
    } finally {
      setIsPlacingOrder(false);
    }
  };
  
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 
                  ${currentStep >= step ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300 text-gray-500'}`}
              >
                {step}
              </div>
              {step < 3 && (
                <div className={`w-24 h-1 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-4">
          <span className={`text-sm ${currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Address
          </span>
          <span className={`text-sm ${currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Payment
          </span>
          <span className={`text-sm ${currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
            Review
          </span>
        </div>
      </div>
    );
  };
  
  const renderAddressForm = () => {
    return (
      <form onSubmit={handleAddressSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Shipping Address</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={addressData.fullName || ''}
              onChange={handleAddressChange}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.fullName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={addressData.email || ''}
              onChange={handleAddressChange}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={addressData.phone || ''}
            onChange={handleAddressChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
          />
          {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={addressData.address || ''}
            onChange={handleAddressChange}
            className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.address ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
          />
          {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={addressData.city || ''}
              onChange={handleAddressChange}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
          </div>
          
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={addressData.postalCode || ''}
              onChange={handleAddressChange}
              className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.postalCode ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
            />
            {formErrors.postalCode && <p className="text-red-500 text-xs mt-1">{formErrors.postalCode}</p>}
          </div>
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    );
  };
  
  const renderPaymentForm = () => {
    return (
      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Payment Method</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="cash"
              name="paymentMethod"
              type="radio"
              value="cash"
              checked={selectedPayment === 'cash'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="cash" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Cash on Delivery
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="jazzcash"
              name="paymentMethod"
              type="radio"
              value="jazzcash"
              checked={selectedPayment === 'jazzcash'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="jazzcash" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
              JazzCash
            </label>
          </div>
          
          {selectedPayment === 'jazzcash' && (
            <div className="ml-7 mt-2 space-y-3">
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  JazzCash Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={paymentData.mobileNumber || ''}
                  onChange={handlePaymentDetailsChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="03XX-XXXXXXX"
                />
                {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <input
              id="easypaisa"
              name="paymentMethod"
              type="radio"
              value="easypaisa"
              checked={selectedPayment === 'easypaisa'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="easypaisa" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
              EasyPaisa
            </label>
          </div>
          
          {selectedPayment === 'easypaisa' && (
            <div className="ml-7 mt-2 space-y-3">
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  EasyPaisa Mobile Number
                </label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={paymentData.mobileNumber || ''}
                  onChange={handlePaymentDetailsChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.mobileNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                  placeholder="03XX-XXXXXXX"
                />
                {formErrors.mobileNumber && <p className="text-red-500 text-xs mt-1">{formErrors.mobileNumber}</p>}
              </div>
            </div>
          )}
          
          <div className="flex items-center">
            <input
              id="bank"
              name="paymentMethod"
              type="radio"
              value="bank"
              checked={selectedPayment === 'bank'}
              onChange={handlePaymentMethodChange}
              className="h-4 w-4 text-blue-600 border-gray-300"
            />
            <label htmlFor="bank" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-200">
              Bank Transfer
            </label>
          </div>
          
          {selectedPayment === 'bank' && (
            <div className="ml-7 mt-2 space-y-3">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  id="bankName"
                  name="bankName"
                  value={paymentData.bankName || ''}
                  onChange={handlePaymentDetailsChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.bankName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {formErrors.bankName && <p className="text-red-500 text-xs mt-1">{formErrors.bankName}</p>}
              </div>
              
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  name="accountNumber"
                  value={paymentData.accountNumber || ''}
                  onChange={handlePaymentDetailsChange}
                  className={`w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white ${formErrors.accountNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                />
                {formErrors.accountNumber && <p className="text-red-500 text-xs mt-1">{formErrors.accountNumber}</p>}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => dispatch(setStep(1))}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue to Review
          </button>
        </div>
      </form>
    );
  };
  
  const renderOrderReview = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Order Review</h2>
        
        {/* Error Message */}
        {formErrors.submit && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{formErrors.submit}</span>
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Shipping Address</h3>
          <p className="text-gray-600 dark:text-gray-300">{address.fullName}</p>
          <p className="text-gray-600 dark:text-gray-300">{address.email}</p>
          <p className="text-gray-600 dark:text-gray-300">{address.phone}</p>
          <p className="text-gray-600 dark:text-gray-300">{address.address}</p>
          <p className="text-gray-600 dark:text-gray-300">{address.city}, {address.postalCode}</p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Payment Method</h3>
          <p className="text-gray-600 dark:text-gray-300 capitalize">{paymentMethod}</p>
          {paymentMethod === 'jazzcash' && paymentDetails.mobileNumber && (
            <p className="text-gray-600 dark:text-gray-300">Mobile: {paymentDetails.mobileNumber}</p>
          )}
          {paymentMethod === 'easypaisa' && paymentDetails.mobileNumber && (
            <p className="text-gray-600 dark:text-gray-300">Mobile: {paymentDetails.mobileNumber}</p>
          )}
          {paymentMethod === 'bank' && (
            <>
              <p className="text-gray-600 dark:text-gray-300">Bank: {paymentDetails.bankName}</p>
              <p className="text-gray-600 dark:text-gray-300">Account: {paymentDetails.accountNumber}</p>
            </>
          )}
        </div>
        
        <div className="border dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 p-4 border-b dark:border-gray-600">Order Items</h3>
          <div className="divide-y dark:divide-gray-600">
            {cartItems?.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4">
                <div className="flex items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h4>
                    <p className="text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
          <div className="flex justify-between mb-2 text-gray-900 dark:text-gray-100">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2 text-gray-900 dark:text-gray-100">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={isPlacingOrder}
          >
            Back
          </button>
          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 ${
              isPlacingOrder ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isPlacingOrder ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Placing Order...</span>
              </>
            ) : (
              'Place Order'
            )}
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Checkout</h1>
        
        {renderStepIndicator()}
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {currentStep === 1 && renderAddressForm()}
          {currentStep === 2 && renderPaymentForm()}
          {currentStep === 3 && renderOrderReview()}
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;