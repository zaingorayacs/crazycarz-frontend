import { createSlice } from "@reduxjs/toolkit";



    const initialState = {
        status:false,
        userData : null,
        accessToken:"",
        refreshToken:""
    }

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
            state.status = false,
            state.userData = null
        }
    }

})

export const {login,logout} = authSlice.actions


export default authSlice.reducer