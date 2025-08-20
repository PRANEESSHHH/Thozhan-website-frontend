import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import jobSlice from "./jobSlice.js";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import companySlice from "./companySlice.js";
import applicationSlice from "./applicationSlice.js";

// Enhanced persist config with better error handling
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['auth'], // Only persist auth to avoid issues with other state
    // Add state migration for version changes
    migrate: (state) => {
        return new Promise((resolve) => {
            try {
                if (!state) {
                    resolve(undefined);
                    return;
                }
                // Basic state validation
                if (typeof state !== 'object') {
                    resolve(undefined);
                    return;
                }
                resolve(state);
            } catch (error) {
                console.warn('State migration failed, using initial state:', error);
                resolve(undefined);
            }
        });
    }
}

const rootReducer = combineReducers({
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice
})

// Wrap rootReducer with error handling
const errorHandlingReducer = (state, action) => {
    try {
        return rootReducer(state, action);
    } catch (error) {
        console.error('Reducer error:', error);
        // Return current state on error to prevent crashes
        return state || {
            auth: { user: null, loading: false },
            job: { allJobs: [], allAdminJobs: [], singleJob: null, searchJobByText: "", allAppliedJobs: [], searchedQuery: "", savedJobs: [] },
            company: { singleCompany: null, companies: [], searchCompanyByText: "", loading: false },
            application: { applicants: null }
        };
    }
};

const persistedReducer = persistReducer(persistConfig, errorHandlingReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            // Add immutability check in development
            immutableCheck: {
                warnAfter: 128,
            },
        }),
    // Add error handling for the store
    devTools: typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.DEV : process.env.NODE_ENV !== 'production',
});

// Enhanced error handling for store operations - FIXED to work with Redux Persist
const originalDispatch = store.dispatch;
store.dispatch = (action) => {
    try {
        const result = originalDispatch(action);
        // Redux Persist expects dispatch to return the result (which could be a promise)
        return result;
    } catch (error) {
        console.error('Store dispatch error:', error);
        // For Redux Persist compatibility, we need to return a resolved promise on error
        // rather than just the action
        return Promise.resolve(action);
    }
};

// Clear corrupted state on startup if flagged
if (typeof localStorage !== 'undefined' && localStorage.getItem('redux-state-corrupted') === 'true') {
    localStorage.removeItem('redux-state-corrupted');
    localStorage.removeItem('persist:root');
    console.warn('Cleared corrupted Redux state');
}

export default store;