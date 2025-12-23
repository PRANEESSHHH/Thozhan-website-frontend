import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        token: null,
        isAuthenticated: false
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload.user || action.payload;
            state.token = action.payload.token || state.token;
            state.isAuthenticated = !!state.user;
            // Reset loading state when user is set
            state.loading = false;
            // Store token in localStorage for cross-origin requests
            if (action.payload.token) {
                localStorage.setItem('token', action.payload.token);
            }
        },
        logout:(state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            // Reset loading state on logout
            state.loading = false;
            // Remove token from localStorage
            localStorage.removeItem('token');
            // Also clear any cookies for local development
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        },
        resetLoading:(state) => {
            state.loading = false;
        }
    }
});

export const {setLoading, setUser, logout, resetLoading} = authSlice.actions;
export default authSlice.reducer;