import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2, Building, Pencil } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
    const params = useParams();
    const isEditMode = !!params.id;
    
    useGetCompanyById(isEditMode ? params.id : null); 

    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            let res;

            if (isEditMode) {
                res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
            } else {
                res = await axios.post(`${COMPANY_API_END_POINT}/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });
            }

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isEditMode && singleCompany) {
            setInput({
                name: singleCompany.name || "",
                description: singleCompany.description || "",
                website: singleCompany.website || "",
                location: singleCompany.location || "",
                file: null
            });
        }
    }, [isEditMode, singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-12 px-4 sm:px-6'>
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                    <div className='flex items-center gap-4 mb-6'>
                        <Button 
                            onClick={() => navigate("/admin/companies")} 
                            variant="ghost" 
                            size="icon"
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className='font-bold text-2xl text-gray-800 flex items-center'>
                            {isEditMode ? 
                                <>
                                    <Pencil className="h-6 w-6 mr-2 text-blue-600" />
                                    Update Company
                                </>
                            :
                                <>
                                    <Building className="h-6 w-6 mr-2 text-green-600" />
                                    Create New Company
                                </>
                            }
                        </h1>
                    </div>
                    
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Company Name</Label>
                            <Input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="e.g., Acme Corporation"
                                value={input.name}
                                onChange={changeEventHandler}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
                            <Input
                                id="description"
                                type="text"
                                name="description"
                                placeholder="A brief description of the company"
                                value={input.description}
                                onChange={changeEventHandler}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                            <Input
                                id="website"
                                type="text"
                                name="website"
                                placeholder="e.g., https://www.acme.com"
                                value={input.website}
                                onChange={changeEventHandler}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                            <Input
                                id="location"
                                type="text"
                                name="location"
                                placeholder="e.g., San Francisco, CA"
                                value={input.location}
                                onChange={changeEventHandler}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <Label htmlFor="logo" className="text-sm font-medium text-gray-700">Company Logo</Label>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="mt-1 block w-full text-gray-900 border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        {loading ? (
                            <Button className="w-full my-6 flex items-center justify-center gap-2" disabled>
                                <Loader2 className='h-4 w-4 animate-spin' /> 
                                Please wait...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-6">
                                {isEditMode ? "Update Company" : "Create Company"}
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CompanySetup;