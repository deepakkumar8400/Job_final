import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';
import { Loader2, UserPlus, Mail, ArrowLeft, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [tempUserId, setTempUserId] = useState(null);
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: null
    });
    const [otp, setOtp] = useState("");
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({ ...prevInput, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setInput(prevInput => ({ ...prevInput, role: value }));
    };

    const changeFileHandler = (e) => {
        setInput(prevInput => ({ ...prevInput, file: e.target.files?.[0] }));
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const checkEmailStatus = async (email) => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/check-registration`, { email });
            if (res.data.exists) {
                if (res.data.verified) {
                    toast.error("User already exists with this email. Please login.");
                    return false;
                } else {
                    setTempUserId(res.data.tempUserId);
                    setStep(2);
                    toast.info("Registration pending. Please verify your email.");
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error(error);
            return true;
        }
    };
    
    const submitHandler = async (e) => {
        e.preventDefault();
        
        const canRegister = await checkEmailStatus(input.email);
        if (!canRegister) return;
        
        const formData = new FormData();
        for (const key in input) {
            if (input[key]) {
                formData.append(key, input[key]);
            }
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true,
            });
            if (res.data.success) {
                setTempUserId(res.data.tempUserId);
                setStep(2);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const verifyOtpHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, { email: input.email, otp });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Verification failed. Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const resendOtpHandler = async () => {
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/resend-otp`, { email: input.email });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    const cancelRegistration = async () => {
        try {
            if (tempUserId) {
                await axios.delete(`${USER_API_END_POINT}/cancel-registration/${tempUserId}`, { withCredentials: true });
                toast.success("Registration cancelled successfully");
            }
            setStep(1);
            setTempUserId(null);
            setOtp("");
        } catch (error) {
            console.error(error);
            toast.error("Failed to cancel registration. Please try again.");
        }
    };

    const getCardTitle = () => {
        return step === 1 ? "Sign Up" : "Verify Your Email";
    };

    const getCardDescription = () => {
        return step === 1 ? "Create a new account to get started." : "A verification code has been sent to your email.";
    };

    return (
        <div className='flex flex-col min-h-screen bg-gray-50'>
            <Navbar />
            <div className='flex items-center justify-center flex-1 p-4'>
                <Card className='w-full max-w-lg mx-auto shadow-lg rounded-xl'>
                    <CardHeader className='space-y-1 text-center'>
                        <div className="flex justify-center items-center gap-2 mb-2">
                             <span className="text-blue-600">
                                {step === 1 ? <UserPlus className="h-8 w-8" /> : <Mail className="h-8 w-8" />}
                            </span>
                             <CardTitle className='text-3xl font-bold'>{getCardTitle()}</CardTitle>
                        </div>
                        <CardDescription>{getCardDescription()}</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className="flex justify-between items-center w-full">
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                <span className={`text-sm mt-2 transition-colors ${step >= 1 ? 'font-medium text-gray-800' : 'text-gray-500'}`}>Account Details</span>
                            </div>
                            <Separator orientation="horizontal" className={`flex-1 mx-2 transition-colors ${step > 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                            <div className="flex flex-col items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                <span className={`text-sm mt-2 transition-colors ${step >= 2 ? 'font-medium text-gray-800' : 'text-gray-500'}`}>Email Verification</span>
                            </div>
                        </div>

                        {/* Step 1: Registration Form */}
                        {step === 1 && (
                            <form onSubmit={submitHandler} className='space-y-4'>
                                <div className='grid gap-4'>
                                    <div className='space-y-2'>
                                        <Label htmlFor="fullname">Full Name</Label>
                                        <Input id="fullname" type="text" name="fullname" value={input.fullname} onChange={changeEventHandler} placeholder="John Doe" required />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" name="email" value={input.email} onChange={changeEventHandler} placeholder="john.doe@example.com" required />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="phoneNumber">Phone Number</Label>
                                        <Input id="phoneNumber" type="tel" name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} placeholder="e.g., +1234567890" required />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" name="password" value={input.password} onChange={changeEventHandler} placeholder="Create a strong password" required />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label>I am a...</Label>
                                        <RadioGroup onValueChange={handleRoleChange} defaultValue={input.role} className="flex gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="student" id="student" />
                                                <Label htmlFor="student">Student</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="recruiter" id="recruiter" />
                                                <Label htmlFor="recruiter">Recruiter</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                    <div className='space-y-2'>
                                        <Label htmlFor="file">Profile Photo (Optional)</Label>
                                        <Input id="file" type="file" onChange={changeFileHandler} accept="image/*" />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                            Registering...
                                        </>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                                <div className='text-center mt-4 text-sm'>
                                    Already have an account?{' '}
                                    <Link to="/login" className='text-blue-600 hover:underline'>Login</Link>
                                </div>
                            </form>
                        )}

                        {/* Step 2: OTP Verification Form */}
                        {step === 2 && (
                            <form onSubmit={verifyOtpHandler} className='space-y-4'>
                                <p className='text-sm text-center'>
                                    Please enter the 6-digit verification code sent to <span className='font-semibold'>{input.email}</span>.
                                </p>
                                <div className='space-y-2'>
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <Input id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="• • • • • •" required maxLength={6} className="text-center text-lg tracking-[0.5em] font-mono" />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                            Verifying...
                                        </>
                                    ) : (
                                        "Verify Account"
                                    )}
                                </Button>
                                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                    <Button type="button" variant="outline" className="flex-1" onClick={resendOtpHandler} disabled={loading}>
                                        Resend Code
                                    </Button>
                                    <Button type="button" variant="ghost" className="flex-1" onClick={() => setStep(1)} disabled={loading}>
                                        <ArrowLeft className="h-4 w-4 mr-2" /> Edit Details
                                    </Button>
                                </div>
                                <Button type="button" variant="destructive" className="w-full mt-4" onClick={cancelRegistration} disabled={loading}>
                                    <XCircle className="h-4 w-4 mr-2" /> Cancel Registration
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Signup;