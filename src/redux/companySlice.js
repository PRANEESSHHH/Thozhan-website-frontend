import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
        loading: false,
    },
    reducers:{
        // actions
        setSingleCompany:(state,action) => {
            state.singleCompany = action.payload;
            // Reset loading when single company is set
            state.loading = false;
        },
        setCompanies:(state,action) => {
            state.companies = action.payload;
            // Reset loading when companies are set
            state.loading = false;
        },
        setSearchCompanyByText:(state,action) => {
            state.searchCompanyByText = action.payload;
        },
        setLoading:(state,action) => {
            state.loading = action.payload;
        },
        resetLoading:(state) => {
            state.loading = false;
        }
    }
});
export const {setSingleCompany, setCompanies, setSearchCompanyByText, setLoading, resetLoading} = companySlice.actions;
export default companySlice.reducer;