import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '@/utils/axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllAdminJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'

const useGetAllAdminJobs = (forceRefresh = false) => {
    const dispatch = useDispatch();
    const { allAdminJobs } = useSelector(store => store.job);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchAllAdminJobs = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log('Fetching admin jobs from:', `${JOB_API_END_POINT}/admin/get`);
            
            const res = await axiosInstance.get(`${JOB_API_END_POINT}/admin/get`, {
                timeout: 30000, // Increased to 30 seconds for demo
            });
            
            console.log('Admin jobs fetch response:', res.data);
            
            if(res.data.success){
                dispatch(setAllAdminJobs(res.data.jobs || []));
                console.log('Admin jobs loaded successfully:', res.data.jobs?.length || 0, 'jobs');
            } else {
                throw new Error(res.data.message || 'Failed to fetch admin jobs');
            }
        } catch (catchError) {
            console.error('Error fetching admin jobs:', catchError);
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
                toast.error(catchError.response?.data?.message || 'Failed to load jobs. Server might be starting up.');
            }
            
            // Set empty array on error
            dispatch(setAllAdminJobs([]));
        } finally {
            setLoading(false);
        }
    }
    
    useEffect(() => {
        // Add small delay before fetching to let server start up
        const timer = setTimeout(() => {
            // Fetch if we don't have jobs, if forceRefresh is true, or if we have an error
            if (allAdminJobs.length === 0 || forceRefresh || error) {
                fetchAllAdminJobs();
            }
        }, 1500); // 1.5 second delay for server startup
        
        return () => clearTimeout(timer);
    }, [forceRefresh]);
    
    // Return fetch function for manual refresh
    return {
        refetch: fetchAllAdminJobs,
        error,
        loading
    };
}

export default useGetAllAdminJobs