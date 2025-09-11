import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import ApplicantsTable from './ApplicantsTable';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAllApplicants } from '@/redux/applicationSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Applicants = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/${params.id}/applicants`, { withCredentials: true });
                dispatch(setAllApplicants(res.data.job));
            } catch (error) {
                console.error("Error fetching applicants:", error);
                toast.error("Failed to load applicants.");
            } finally {
                setLoading(false);
            }
        };
        fetchAllApplicants();
    }, [dispatch, params.id]);

    return (
        <div>
            <Navbar />
            <div className='container mx-auto py-8'>
                <Card className="shadow-lg rounded-lg">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2 text-2xl font-bold text-gray-800">
                            Applicants 
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                            ) : (
                                <span className="text-gray-500 text-lg">({applicants?.applications?.length || 0})</span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="flex justify-center items-center min-h-[300px]">
                                <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                                <span className="ml-2 text-gray-600">Loading applicants...</span>
                            </div>
                        ) : applicants?.applications?.length > 0 ? (
                            <ApplicantsTable />
                        ) : (
                            <div className="text-center py-20 text-gray-500 text-lg">
                                No applicants found for this job.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Applicants;