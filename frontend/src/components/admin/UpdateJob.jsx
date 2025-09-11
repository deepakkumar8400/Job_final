import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea'; // Import Textarea component
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, ArrowLeft, Briefcase } from 'lucide-react';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const UpdateJob = () => {
    useGetAllCompanies();
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        location: '',
        jobType: '',
        experience: '',
        position: '',
        companyId: ''
    });
    const [loading, setLoading] = useState(false);
    const [jobDetailsLoading, setJobDetailsLoading] = useState(true);

    const navigate = useNavigate();
    const { id } = useParams();
    const { companies } = useSelector(store => store.company);

    useEffect(() => {
        const fetchJob = async () => {
            if (!id) return;
            setJobDetailsLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`, {
                    withCredentials: true
                });

                if (res.data.success) {
                    const job = res.data.job || res.data.data;
                    if (!job) {
                        toast.error('Job not found');
                        navigate('/admin/jobs');
                        return;
                    }
                    setInput({
                        title: job.title || '',
                        description: job.description || '',
                        requirements: job.requirements ? job.requirements.join(', ') : '',
                        salary: job.salary || '',
                        location: job.location || '',
                        jobType: job.jobType || '',
                        experience: job.experienceLevel || job.experience || '',
                        position: job.position || '',
                        companyId: job.company?._id || job.companyId || ''
                    });
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                const errorMessage = error.response?.data?.message ||
                                     error.response?.data?.error ||
                                     'Failed to fetch job details. Please try again.';
                toast.error(errorMessage);
                navigate('/admin/jobs');
            } finally {
                setJobDetailsLoading(false);
            }
        };
        fetchJob();
    }, [id, navigate]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({ ...prevInput, [name]: value }));
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value.toLowerCase());
        setInput(prevInput => ({ ...prevInput, companyId: selectedCompany?._id || '' }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.companyId || !input.title || !input.description || !input.requirements) {
            toast.error('Please fill in all required fields.');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${id}`, {
                ...input,
                requirements: input.requirements.split(',').map(req => req.trim()).filter(req => req !== '')
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            console.error('Update error:', error);
            const errorMessage = error.response?.data?.message ||
                                 error.response?.data?.error ||
                                 'Update failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <div className="flex items-center justify-center p-4">
                <Card className="w-full max-w-2xl mx-auto my-10 shadow-lg rounded-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={() => navigate("/admin/jobs")}
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:bg-gray-100 transition-colors"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                                        <Briefcase className="h-6 w-6 mr-2 text-blue-600" />
                                        Update Job
                                    </CardTitle>
                                    <CardDescription>
                                        Edit the details for this job listing.
                                    </CardDescription>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    {jobDetailsLoading ? (
                        <CardContent className="flex justify-center items-center min-h-[300px] flex-col gap-2">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                            <span className="text-gray-600">Loading job details...</span>
                        </CardContent>
                    ) : (
                        <CardContent>
                            <form onSubmit={submitHandler} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Job Title</Label>
                                        <Input id="title" name="title" value={input.title} onChange={changeEventHandler} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="salary">Salary</Label>
                                        <Input id="salary" name="salary" value={input.salary} onChange={changeEventHandler} placeholder="$80,000 - $100,000" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" name="location" value={input.location} onChange={changeEventHandler} placeholder="New York, NY" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="jobType">Job Type</Label>
                                        <Input id="jobType" name="jobType" value={input.jobType} onChange={changeEventHandler} placeholder="Full-time, Remote, etc." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Experience Level</Label>
                                        <Input id="experience" name="experience" value={input.experience} onChange={changeEventHandler} placeholder="Mid-level, Senior, etc." />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="position">Number of Positions</Label>
                                        <Input id="position" type="number" name="position" value={input.position} onChange={changeEventHandler} min="1" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="company">Company</Label>
                                        {companies && companies.length > 0 ? (
                                            <Select
                                                onValueChange={selectChangeHandler}
                                                value={companies.find(c => c._id === input.companyId)?.name.toLowerCase() || ''}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a Company" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Companies</SelectLabel>
                                                        {companies.map((company) => (
                                                            <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                                {company.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <p className="text-sm text-gray-500 mt-2">No companies available. Please create one first.</p>
                                        )}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="description">Job Description</Label>
                                        <Textarea id="description" name="description" value={input.description} onChange={changeEventHandler} className="min-h-[100px]" required />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                                        <Textarea id="requirements" name="requirements" value={input.requirements} onChange={changeEventHandler} className="min-h-[100px]" placeholder="e.g., React, Node.js, MongoDB" required />
                                    </div>
                                </div>
                                
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating Job...
                                        </>
                                    ) : (
                                        'Update Job'
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default UpdateJob;