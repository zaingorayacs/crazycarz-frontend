import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  },
  paymentMethod: '',
  paymentDetails: {},
  orderSummary: {},
  currentStep: 1,
  orderId: null
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    saveAddress: (state, action) => {
      state.address = action.payload;
      state.currentStep = 2;
    },
    selectPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload.method;
      state.paymentDetails = action.payload.details || {};
      state.currentStep = 3;
    },
    setOrderSummary: (state, action) => {
      state.orderSummary = action.payload;
    },
    confirmOrder: (state) => {
      // Generate a random order ID
      state.orderId = Math.floor(100000 + Math.random() * 900000).toString();
    },
    resetCheckout: () => initialState,
    setStep: (state, action) => {
      state.currentStep = action.payload;
    }
  }
});

export const { 
  saveAddress, 
  selectPaymentMethod, 
  setOrderSummary, 
  confirmOrder, 
  resetCheckout,
  setStep
} = checkoutSlice.actions;

export default checkoutSlice.reducer;