import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSavedJob, setSavedJobs } from '@/redux/jobSlice';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const useSavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs } = useSelector(state => state.job);
  const { user } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved jobs from backend and fall back to localStorage
  useEffect(() => {
    if (user) {
      // Try to load from localStorage first for instant display
      const storedSavedJobs = localStorage.getItem(`thozhan_saved_jobs_${user._id}`);
      if (storedSavedJobs) {
        try {
          const parsedJobs = JSON.parse(storedSavedJobs);
          dispatch(setSavedJobs(parsedJobs));
        } catch (error) {
          // Silent error handling for localStorage
          localStorage.removeItem(`thozhan_saved_jobs_${user._id}`);
        }
      }
      
      // Then fetch from backend to ensure we have the latest data
      const fetchSavedJobs = async () => {
        setError(null);
        try {
          setIsLoading(true);
          const response = await axios.get(`${USER_API_END_POINT}/jobs/saved`,{withCredentials:true});
          
          if (response.data.success) {
            // Check if the backend encountered population issues
            if (response.data.populationFailed) {
              // Just use the job IDs if population failed
              dispatch(setSavedJobs(response.data.savedJobs));
            } else {
              // Extract job IDs from the populated response
              const jobIds = response.data.savedJobs.map(job => job._id);
              dispatch(setSavedJobs(jobIds));
            }
            
            // Update localStorage
            localStorage.setItem(`thozhan_saved_jobs_${user._id}`, JSON.stringify(
              response.data.populationFailed ? response.data.savedJobs : response.data.savedJobs.map(job => job._id)
            ));
          }
        } catch (error) {
          // Set error state instead of just logging
          setError(error);
          
          // Fallback to user savedJobs from profile if available
          if (user.savedJobs && user.savedJobs.length > 0) {
            dispatch(setSavedJobs(user.savedJobs));
            localStorage.setItem(`thozhan_saved_jobs_${user._id}`, JSON.stringify(user.savedJobs));
          }
        } finally {
          setIsLoading(false);
        }
      };
      
      // Initial load from backend
      fetchSavedJobs();
    }
  }, [dispatch, user]);

  // Toggle a job's saved status
  const toggleJobSaved = async (jobId) => {
    if (!jobId) return;
    
    // Optimistic update in UI first
    dispatch(toggleSavedJob(jobId));
    
    if (user) {
      try {
        // Update localStorage
        const updatedSavedJobs = savedJobs.includes(jobId) 
          ? savedJobs.filter(id => id !== jobId)
          : [...savedJobs, jobId];
        localStorage.setItem(`thozhan_saved_jobs_${user._id}`, JSON.stringify(updatedSavedJobs));
        
        // Send to backend
        const response = await axios.post(
          `${USER_API_END_POINT}/jobs/toggle-save/${jobId}`,
          {},{withCredentials:true}
        );
        
        if (!response.data.success) {
          // Revert the optimistic update if the API call fails
          dispatch(toggleSavedJob(jobId));
          toast.error('Failed to update saved job status');
        }
      } catch (error) {
        // Revert the optimistic update
        dispatch(toggleSavedJob(jobId));
        toast.error('Failed to update saved job status');
      }
    }
  };

  // Check if a job is saved
  const isJobSaved = (jobId) => {
    if (!jobId || !savedJobs) return false;
    return savedJobs.includes(jobId);
  };

  return {
    savedJobs,
    toggleJobSaved,
    isJobSaved,
    isLoading,
    error
  };
};

export default useSavedJobs; 