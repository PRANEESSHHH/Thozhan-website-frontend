import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '@/utils/axios';
import { COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleCompany, setLoading } from '@/redux/companySlice';
import { setAllJobs } from '@/redux/jobSlice'

const useGetCompanyById = (companyId) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchSingleCompany = async () => {
            try {
                dispatch(setLoading(true));
                const res = await axiosInstance.get(`${COMPANY_API_END_POINT}/get/${companyId}`);
                console.log(res.data.company);
                if(res.data.success){
                    dispatch(setSingleCompany(res.data.company));
                }
            } catch (error) {
                console.log(error);
                dispatch(setLoading(false));
            }
        }
        if (companyId) {
            fetchSingleCompany();
        }
    },[companyId, dispatch])
}

export default useGetCompanyById