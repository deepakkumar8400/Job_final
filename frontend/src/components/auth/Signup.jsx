import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [step, setStep] = useState(1); // 1: Registration, 2: OTP Verification
    const [tempUserId, setTempUserId] = useState(null);
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [otp, setOtp] = useState("");
    const {loading, user} = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const checkEmailStatus = async (email) => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/check-registration`, {
                email
            }, {
                withCredentials: true,
            });
            
            if (res.data.exists) {
                if (res.data.verified) {
                    toast.error("User already exists with this email. Please login.");
                    return false;
                } else {
                    // If registration exists but not verified, allow resending OTP
                    setTempUserId(res.data.tempUserId);
                    setStep(2);
                    toast.info("Registration pending. Please verify your email.");
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.log(error);
            return true; // Proceed with registration on error
        }
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Check email status first
        const canRegister = await checkEmailStatus(input.email);
        if (!canRegister) return;
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                setTempUserId(res.data.tempUserId);
                setStep(2); // Move to OTP verification step
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    const verifyOtpHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`, {
                email: input.email,
                otp
            }, {
                withCredentials: true,
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Verification failed. Please try again.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    const resendOtpHandler = async () => {
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/resend-otp`, {
                email: input.email
            }, {
                withCredentials: true,
            });
            
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to resend OTP. Please try again.");
            }
        } finally {
            dispatch(setLoading(false));
        }
    }

    const cancelRegistration = async () => {
        try {
            // Delete the temporary user if verification is cancelled
            if (tempUserId) {
                await axios.delete(`${USER_API_END_POINT}/cancel-registration/${tempUserId}`, {
                    withCredentials: true,
                });
                toast.success("Registration cancelled successfully");
            }
            setStep(1);
            setTempUserId(null);
            setOtp("");
        } catch (error) {
            console.log(error);
            toast.error("Failed to cancel registration. Please try again.");
        }
    }

    const goBackToRegistration = () => {
        setStep(1);
        setOtp("");
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                {step === 1 ? (
                    <form onSubmit={submitHandler} className='w-full md:w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                        <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                        <div className='my-2'>
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeEventHandler}
                                placeholder="Enter your full name"
                                required
                            />
                        </div>
                        <div className='my-2'>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="example@gmail.com"
                                required
                            />
                        </div>
                        <div className='my-2'>
                            <Label>Phone Number</Label>
                            <Input
                                type="text"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeEventHandler}
                                placeholder="1234567890"
                                required
                            />
                        </div>
                        <div className='my-2'>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Create a strong password"
                                required
                            />
                        </div>
                        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 my-5'>
                            <RadioGroup className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                        required
                                    />
                                    <Label htmlFor="r1">student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                        required
                                    />
                                    <Label htmlFor="r2">recruiter</Label>
                                </div>
                            </RadioGroup>
                            <div className='flex flex-col gap-2 w-full md:w-auto'>
                                <Label>Profile Photo</Label>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                        {
                            loading ? (
                                <Button className="w-full my-4" disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                    Please wait
                                </Button>
                            ) : (
                                <Button type="submit" className="w-full my-4">
                                    Signup
                                </Button>
                            )
                        }
                        <div className='text-center mt-4'>
                            <span className='text-sm'>
                                Already have an account?{' '}
                                <Link to="/login" className='text-blue-600 hover:underline'>
                                    Login
                                </Link>
                            </span>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={verifyOtpHandler} className='w-full md:w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                        <h1 className='font-bold text-xl mb-5'>Verify Your Email</h1>
                        <p className='mb-4'>
                            We've sent a verification code to your email address:{' '}
                            <span className='font-semibold'>{input.email}</span>
                        </p>
                        
                        <div className='my-2'>
                            <Label>Verification Code</Label>
                            <Input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter 6-digit code"
                                required
                                maxLength={6}
                                className="text-center text-lg font-mono"
                            />
                        </div>
                        
                        {
                            loading ? (
                                <Button className="w-full my-4" disabled>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                    Verifying...
                                </Button>
                            ) : (
                                <>
                                    <Button type="submit" className="w-full my-4">
                                        Verify Account
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="flex-1" 
                                            onClick={resendOtpHandler}
                                        >
                                            Resend Code
                                        </Button>
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            className="flex-1" 
                                            onClick={goBackToRegistration}
                                        >
                                            Edit Details
                                        </Button>
                                    </div>
                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        className="w-full mt-2" 
                                        onClick={cancelRegistration}
                                    >
                                        Cancel Registration
                                    </Button>
                                </>
                            )
                        }
                        
                        <p className='text-sm text-center mt-4'>
                            Didn't receive the code? Check your spam folder or{' '}
                            <button 
                                type="button" 
                                onClick={resendOtpHandler}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                click here to resend
                            </button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Signup