import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllJobs } from '@/redux/jobSlice'
import { toast } from 'sonner'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    
    useEffect(()=>{
        const fetchAllJobs = async () => {
            try {
                console.log('Fetching all jobs with keyword:', searchedQuery);
                
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                    timeout: 30000, // Increased timeout for demo
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                console.log('Jobs fetch response:', res.data);
                
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs || []));
                    console.log('Jobs loaded successfully:', res.data.jobs?.length || 0, 'jobs');
                } else {
                    throw new Error(res.data.message || 'Failed to fetch jobs');
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
                
                if (error.code === 'ECONNABORTED') {
                    toast.error('Request timeout. Backend server might be slow. Please wait and try again.');
                } else if (error.response?.status === 500) {
                    toast.error('Server error while fetching jobs. Please try again later.');
                } else if (error.message && error.message.includes('Network Error')) {
                    toast.error('Network error. Please check if the backend server is running on port 3000.');
                } else if (error.code === 'ECONNREFUSED') {
                    toast.error('Cannot connect to server. Please ensure backend is running on port 3000.');
                } else {
                    toast.error(error.response?.data?.message || 'Failed to load jobs. Server might be starting up.');
                }
                
                // Set empty array on error
                dispatch(setAllJobs([]));
            }
        }
        
        // Add delay before fetching to let server start up
        const timer = setTimeout(() => {
            fetchAllJobs();
        }, 2000); // 2 second delay for server startup
        
        return () => clearTimeout(timer);
    },[searchedQuery, dispatch])
}

export default useGetAllJobs