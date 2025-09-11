import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2, LogIn as LogInIcon, UserCircle, Briefcase, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "student",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prevInput => ({ ...prevInput, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setInput(prevInput => ({ ...prevInput, role: value }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred during login.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
            <Navbar />
            
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                
                <Card className="w-full max-w-md backdrop-blur-sm bg-white/90 dark:bg-gray-900/90 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-3xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                    
                    <CardHeader className="space-y-1 text-center pb-2">
                        <div className="flex justify-center items-center mb-2 relative">
                            <div className="absolute -inset-4 bg-blue-100 dark:bg-blue-900/30 rounded-full animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                                <LogInIcon className="h-8 w-8 text-white" />
                            </div>
                            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-yellow-400" />
                        </div>
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
                            Sign in to continue your journey
                        </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 pt-4">
                        <form onSubmit={submitHandler} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium flex items-center">
                                        <Mail className="h-4 w-4 mr-1" /> Email Address
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={input.email}
                                            onChange={changeEventHandler}
                                            placeholder="your-email@example.com"
                                            required
                                            className="pl-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 py-5"
                                        />
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium flex items-center">
                                        <Lock className="h-4 w-4 mr-1" /> Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={input.password}
                                            onChange={changeEventHandler}
                                            required
                                            className="pl-10 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 py-5"
                                        />
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">I am a:</Label>
                                <RadioGroup
                                    onValueChange={handleRoleChange}
                                    defaultValue={input.role}
                                    className="flex space-x-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl transition-all duration-300"
                                >
                                    <div 
                                        className={`flex-1 transition-all duration-300 ${input.role === 'student' ? 'bg-white dark:bg-gray-700 shadow-md' : 'hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
                                        style={{ borderRadius: '12px' }}
                                    >
                                        <RadioGroupItem value="student" id="student" className="hidden" />
                                        <Label 
                                            htmlFor="student" 
                                            className={`flex items-center justify-center py-3 px-4 rounded-xl cursor-pointer transition-colors duration-300 ${input.role === 'student' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            <UserCircle className="h-5 w-5 mr-2" /> 
                                            Student
                                        </Label>
                                    </div>
                                    <div 
                                        className={`flex-1 transition-all duration-300 ${input.role === 'recruiter' ? 'bg-white dark:bg-gray-700 shadow-md' : 'hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
                                        style={{ borderRadius: '12px' }}
                                    >
                                        <RadioGroupItem value="recruiter" id="recruiter" className="hidden" />
                                        <Label 
                                            htmlFor="recruiter" 
                                            className={`flex items-center justify-center py-3 px-4 rounded-xl cursor-pointer transition-colors duration-300 ${input.role === 'recruiter' ? 'text-blue-600 font-semibold' : 'text-gray-600 dark:text-gray-400'}`}
                                        >
                                            <Briefcase className="h-5 w-5 mr-2" /> 
                                            Recruiter
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 relative overflow-hidden group"
                                disabled={loading}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <span className="relative z-10">Log In</span>
                                        <div className={`absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${isHovered ? 'opacity-100' : ''}`}></div>
                                    </>
                                )}
                            </Button>
                        </form>
                        
                        <div className="text-center pt-4">
                            <div className="relative flex items-center justify-center">
                                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                                <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">New here?</span>
                                <div className="flex-grow border-t border-gray-300 dark:border-gray-700"></div>
                            </div>
                            
                            <div className="mt-4 text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link 
                                    to="/signup" 
                                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-300 relative group"
                                >
                                    Sign up
                                    <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
};

export default Login;