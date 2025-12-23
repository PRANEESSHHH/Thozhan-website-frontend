import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import axiosInstance from '@/utils/axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { setAllJobs } from '@/redux/jobSlice'

const useGetAllEmployersJobs = () => {
    const dispatch = useDispatch();
    
    useEffect(() => {
        const fetchAllEmployersJobs = async () => {
            try {
                const res = await axiosInstance.get(`${JOB_API_END_POINT}/admin/all-employers`);
                if(res.data.success){
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchAllEmployersJobs();
    }, [dispatch])
}

export default useGetAllEmployersJobs 