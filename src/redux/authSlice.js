import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        isAuthenticated: false
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
            // Reset loading state when user is set
            state.loading = false;
            // Set token cookie if token is present in payload
            if (action.payload && action.payload.token) {
                document.cookie = `token=${action.payload.token}; path=/; max-age=${7 * 24 * 60 * 60}`;
            }
        },
        logout:(state) => {
            state.user = null;
            state.isAuthenticated = false;
            // Reset loading state on logout
            state.loading = false;
            // Remove token cookie on logout
            document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        },
        resetLoading:(state) => {
            state.loading = false;
        }
    }
});

export const {setLoading, setUser, logout, resetLoading} = authSlice.actions;
export default authSlice.reducer;