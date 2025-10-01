import { createSlice } from '@reduxjs/toolkit';

// Load cart from localStorage if available
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: loadCartFromStorage()
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    },
    updateQty: (state, action) => {
      const { id, qty } = action.payload;
      const itemToUpdate = state.cartItems.find(item => item.id === id);
      if (itemToUpdate) {
        itemToUpdate.quantity = qty;
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state.cartItems));
    }
  }
});

export const { addToCart, removeFromCart, clearCart, updateQty } = cartSlice.actions;
export default cartSlice.reducer;