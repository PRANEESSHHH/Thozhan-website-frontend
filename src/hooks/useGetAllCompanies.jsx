import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axiosInstance from '@/utils/axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { setCompanies, setLoading } from '@/redux/companySlice';
import { toast } from 'sonner';

const useGetAllCompanies = (forceRefresh = false) => {
    const dispatch = useDispatch();
    const { companies, loading } = useSelector(store => store.company);
    const [error, setError] = useState(null);
    
    const fetchCompanies = async () => {
        try {
            dispatch(setLoading(true));
            setError(null);
            
            console.log('Fetching companies from:', `${COMPANY_API_END_POINT}/get`);
            
            const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                timeout: 30000, // Increased to 30 seconds for demo
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            
            console.log('Company fetch response:', res.data);
            
            if (res.data.success) {
                dispatch(setCompanies(res.data.companies || []));
                console.log('Companies loaded successfully:', res.data.companies?.length || 0, 'companies');
            } else {
                throw new Error(res.data.message || 'Failed to fetch companies');
            }
        } catch (catchError) {
            console.error('Error fetching companies:', catchError);
            setError(catchError);
            
            if (catchError.code === 'ECONNABORTED') {
                toast.error('Request timeout. Backend server might be slow. Please wait and try again.');
            } else if (catchError.response?.status === 401) {
                toast.error('Authentication failed. Please login again.');
            } else if (catchError.response?.status === 500) {
                toast.error('Server error. Please try again later.');
            } else if (catchError.message && catchError.message.includes('Network Error')) {
                toast.error('Network error. Please check if the backend server is running on port 3000.');
            } else if (catchError.code === 'ECONNREFUSED') {
                toast.error('Cannot connect to server. Please ensure backend is running on port 3000.');
            } else {
                toast.error(catchError.response?.data?.message || 'Failed to load companies. Server might be starting up.');
            }
            
            // Set empty array on error
            dispatch(setCompanies([]));
        } finally {
            dispatch(setLoading(false));
        }
    };
    
    useEffect(() => {
        // Add small delay before fetching to let server start up
        const timer = setTimeout(() => {
            // Fetch if we don't have companies, if forceRefresh is true, or if we have an error
            if (companies.length === 0 || forceRefresh || error) {
                fetchCompanies();
            }
        }, 1000); // 1 second delay for server startup
        
        return () => clearTimeout(timer);
    }, [forceRefresh]);
    
    // Return fetch function for manual refresh
    return {
        refetch: fetchCompanies,
        error,
        loading
    };
}

export default useGetAllCompanies