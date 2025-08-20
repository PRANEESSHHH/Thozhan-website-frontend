import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name:"job",
    initialState:{
        allJobs:[],
        allAdminJobs:[],
        singleJob:null, 
        searchJobByText:"",
        allAppliedJobs:[],
        searchedQuery:"",
        savedJobs:[],
    },
    reducers:{
        // actions
        setAllJobs:(state,action) => {
            state.allJobs = action.payload;
        },
        setSingleJob:(state,action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs:(state,action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText:(state,action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs:(state,action) => {
            state.allAppliedJobs = action.payload;
        },
        setSearchedQuery:(state,action) => {
            state.searchedQuery = action.payload;
        },
        toggleSavedJob:(state,action) => {
            const jobId = action.payload;
            const jobIndex = state.savedJobs.findIndex(id => id === jobId);
            
            if (jobIndex !== -1) {
                state.savedJobs = state.savedJobs.filter(id => id !== jobId);
            } else {
                state.savedJobs.push(jobId);
            }
        },
        setSavedJobs:(state,action) => {
            state.savedJobs = action.payload;
        }
    }
});
export const {
    setAllJobs, 
    setSingleJob, 
    setAllAdminJobs,
    setSearchJobByText, 
    setAllAppliedJobs,
    setSearchedQuery,
    toggleSavedJob,
    setSavedJobs
} = jobSlice.actions;

// Alias for backward compatibility
export const setAdminJobs = setAllAdminJobs;

export default jobSlice.reducer;