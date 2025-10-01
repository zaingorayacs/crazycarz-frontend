import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('isAuthenticated', 'true');
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Clear from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },
    register: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Store in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('isAuthenticated', 'true');
    }
  }
});

export const { login, logout, register } = authSlice.actions;
export default authSlice.reducer;