import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const [refreshCount, setRefreshCount] = useState(0);

    const refreshCompanies = () => {
        setRefreshCount(prev => prev + 1);
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await axios.get(`${COMPANY_API_END_POINT}/get`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                }
            } catch (error) {
                console.log('Error fetching companies:', error);
            }
        }
        fetchCompanies();
    }, [dispatch, refreshCount]);

    return refreshCompanies;
}

export default useGetAllCompanies