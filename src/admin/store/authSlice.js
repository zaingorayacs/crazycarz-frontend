import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const loadFromLocalStorage = () => {
    try {
        const adminToken = localStorage.getItem('adminToken');
        const adminRefreshToken = localStorage.getItem('adminRefreshToken');
        const adminData = localStorage.getItem('adminData');
        
        if (adminToken && adminData) {
            return {
                status: true,
                userData: JSON.parse(adminData),
                accessToken: adminToken,
                refreshToken: adminRefreshToken || ""
            };
        }
    } catch (error) {
        console.error('Error loading auth state from localStorage:', error);
    }
    
    return {
        status: false,
        userData: null,
        accessToken: "",
        refreshToken: ""
    };
};

const initialState = loadFromLocalStorage();

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        login: (state,action) => {
            state.status = true,
            state.userData = action.payload.userData,
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
        },
        logout:(state,action)=>{
            state.status = false;
            state.userData = null;
            state.accessToken = "";
            state.refreshToken = "";
            
            // Clear localStorage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminRefreshToken');
            localStorage.removeItem('adminData');
        }
    }

})

export const {login,logout} = authSlice.actions


export default authSlice.reducer