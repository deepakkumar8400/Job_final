import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

const PostJob = () => {
    const [step, setStep] = useState(1);
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { companies } = useSelector(store => store.company);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({ ...prevInput, [name]: value }));
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        if (selectedCompany) {
            setInput(prevInput => ({ ...prevInput, companyId: selectedCompany._id }));
        }
    };

    const nextStep = () => {
        // Simple validation for the current step before proceeding
        if (step === 1 && (!input.title || !input.description || !input.requirements)) {
            toast.error("Please fill in all job details.");
            return;
        }
        if (step === 2 && (!input.salary || !input.location || !input.jobType || !input.experience)) {
            toast.error("Please fill in all job specifics.");
            return;
        }
        setStep(prevStep => prevStep + 1);
    };

    const prevStep = () => {
        setStep(prevStep => prevStep - 1);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response.data.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const renderFormStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input id="title" name="title" value={input.title} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description</Label>
                            <Textarea id="description" name="description" value={input.description} onChange={changeEventHandler} className='min-h-[100px]' />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements</Label>
                            <Textarea id="requirements" name="requirements" value={input.requirements} onChange={changeEventHandler} className='min-h-[100px]' />
                        </div>
                    </>
                );
            case 2:
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="salary">Salary</Label>
                            <Input id="salary" name="salary" value={input.salary} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" name="location" value={input.location} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jobType">Job Type</Label>
                            <Input id="jobType" name="jobType" value={input.jobType} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience Level</Label>
                            <Input id="experience" name="experience" value={input.experience} onChange={changeEventHandler} />
                        </div>
                    </>
                );
            case 3:
                return (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="position">Number of Positions</Label>
                            <Input id="position" type="number" name="position" value={input.position} onChange={changeEventHandler} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            {companies.length > 0 ? (
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger id="company">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Companies</SelectLabel>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company.name.toLowerCase()}>{company.name}</SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className='text-sm text-red-600 font-bold'>*Please register a company first before posting a job.</p>
                            )}
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const getCardTitle = () => {
        switch (step) {
            case 1:
                return "1/3. Job Details";
            case 2:
                return "2/3. Job Specifics";
            case 3:
                return "3/3. Company & Positions";
            default:
                return "Post a New Job";
        }
    };

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='flex items-center justify-center p-4'>
                <Card className='w-full max-w-2xl mx-auto my-10 shadow-lg rounded-xl'>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-extrabold text-gray-900">{getCardTitle()}</CardTitle>
                        <CardDescription>
                            {step === 1 && "Start by providing the fundamental details of the job listing."}
                            {step === 2 && "Tell us more about the specific requirements for this role."}
                            {step === 3 && "Finalize the listing by selecting the company and number of open positions."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mb-8">
                            {[1, 2, 3].map(s => (
                                <div key={s} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white transition-colors duration-300 ${step === s ? 'bg-indigo-600' : 'bg-gray-400'}`}>
                                        {s}
                                    </div>
                                    {s < 3 && <Separator orientation="horizontal" className={`w-24 mt-2 ${step > s ? 'bg-indigo-600' : 'bg-gray-300'}`} />}
                                </div>
                            ))}
                        </div>

                        <form onSubmit={submitHandler} className='space-y-6'>
                            <div className='space-y-6'>
                                {renderFormStep()}
                            </div>

                            <div className="flex justify-between items-center mt-6">
                                {step > 1 && (
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                                    </Button>
                                )}
                                {step < 3 ? (
                                    <Button type="button" onClick={nextStep} className="ml-auto">
                                        Next <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button type="submit" className="ml-auto" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Please wait...
                                            </>
                                        ) : (
                                            'Post New Job'
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PostJob;