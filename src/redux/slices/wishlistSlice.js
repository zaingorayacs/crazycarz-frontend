import { createSlice } from '@reduxjs/toolkit';

// Load wishlist from localStorage if available
const loadWishlistFromStorage = () => {
  try {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      return JSON.parse(savedWishlist);
    }
  } catch (error) {
    console.error('Error loading wishlist from localStorage:', error);
  }
  return [];
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    wishlistItems: loadWishlistFromStorage()
  },
  reducers: {
    addToWishlist: (state, action) => {
      const item = action.payload;
      const existingItem = state.wishlistItems.find(wishlistItem => wishlistItem.id === item.id);
      
      if (!existingItem) {
        state.wishlistItems.push(item);
      }
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
    },
    removeFromWishlist: (state, action) => {
      state.wishlistItems = state.wishlistItems.filter(item => item.id !== action.payload);
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
    },
    clearWishlist: (state) => {
      state.wishlistItems = [];
      
      // Save to localStorage
      localStorage.setItem('wishlist', JSON.stringify(state.wishlistItems));
    },
    moveToCart: (state, action) => {
      // This action doesn't modify the wishlist state directly
      // The actual moving logic will be handled by the component that dispatches both
      // removeFromWishlist and addToCart actions
    }
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist, moveToCart } = wishlistSlice.actions;

export default wishlistSlice.reducer;