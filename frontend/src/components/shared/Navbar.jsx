import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { LogOut, User2, Menu, X, Briefcase, Home, Building2 } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logoutHandler = async () => {
        setIsLoggingOut(true);
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message || "Logout failed");
            }
        } catch (error) {
            console.log("Logout error:", error);

            const errorMessage = error.response?.data?.message ||
                                 error.message ||
                                 "Logout failed. Please try again.";

            toast.error(errorMessage);
            dispatch(setUser(null));
            navigate("/");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const isActiveLink = (path) => {
        return location.pathname === path;
    };

    const NavLink = ({ to, children, icon: Icon }) => (
        <li>
            <Link
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md transition-colors ${isActiveLink(to) ? 'text-[#6A38C2] bg-purple-50 font-semibold' : 'text-gray-700 hover:text-[#6A38C2] hover:bg-gray-50'}`}
                onClick={() => setMobileMenuOpen(false)}
            >
                {Icon && <Icon size={16} />}
                {children}
            </Link>
        </li>
    );

    return (
        <div className='bg-white shadow-sm border-b sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo */}
                <Link to={user ? (user.role === 'recruiter' ? '/admin/companies' : '/') : '/'} className='flex items-center gap-2'>
                    <div className='bg-gradient-to-r from-[#6A38C2] to-[#F83002] p-1.5 rounded-md'>
                        <Briefcase className='text-white' size={20} />
                    </div>
                    <h1 className='text-2xl font-bold'>Jo00b<span className='text-[#F83002]'>Portal</span></h1>
                </Link>

                {/* Desktop Navigation */}
                <div className='hidden md:flex items-center gap-8'>
                    <ul className='flex font-medium items-center gap-1'>
                        {user && user.role === 'recruiter' ? (
                            <>
                                <NavLink to="/admin/companies" icon={Building2}>Companies</NavLink>
                                <NavLink to="/admin/jobs" icon={Briefcase}>Jobs</NavLink>
                            </>
                        ) : (
                            <>
                                <NavLink to="/" icon={Home}>Home</NavLink>
                                <NavLink to="/jobs" icon={Briefcase}>Jobs</NavLink>
                            </>
                        )}
                    </ul>
                    {user ? (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-purple-50">
                                    <Avatar className="h-8 w-8 ring-2 ring-purple-100">
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto}
                                            alt={user?.fullname || "User"}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white">
                                            {user?.fullname?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4" align="end" forceMount>
                                <div className="flex flex-col space-y-4">
                                    <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                                        <Avatar className="h-12 w-12 ring-2 ring-white">
                                            <AvatarImage
                                                src={user?.profile?.profilePhoto}
                                                alt={user?.fullname || "User"}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white">
                                                {user?.fullname?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col space-y-1">
                                            <h4 className="text-sm font-semibold">{user?.fullname}</h4>
                                            <p className="text-xs text-muted-foreground capitalize">
                                                {user?.role} • {user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col space-y-1">
                                        {user && user.role === 'student' && (
                                            <Link to="/profile">
                                                <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-md hover:bg-gray-100">
                                                    <User2 className="mr-2 h-4 w-4" />
                                                    View Profile
                                                </Button>
                                            </Link>
                                        )}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start px-3 py-2 rounded-md text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={logoutHandler}
                                            disabled={isLoggingOut}
                                        >
                                            <LogOut className="mr-2 h-4 w-4" />
                                            {isLoggingOut ? "Logging out..." : "Logout"}
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    ) : (
                        <div className='flex items-center gap-2'>
                            <Link to="/login">
                                <Button variant="outline" className="border-[#6A38C2] text-[#6A38C2] hover:bg-purple-50">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7c4dcc]">
                                    Signup
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-gray-700"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden border-t bg-white py-4 px-4`}>
                <ul className="flex flex-col space-y-2">
                    {user && user.role === 'recruiter' ? (
                        <>
                            <NavLink to="/admin/companies" icon={Building2}>Companies</NavLink>
                            <NavLink to="/admin/jobs" icon={Briefcase}>Jobs</NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/" icon={Home}>Home</NavLink>
                            <NavLink to="/jobs" icon={Briefcase}>Jobs</NavLink>
                        </>
                    )}
                </ul>

                {user ? (
                    <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-gray-50 rounded-lg">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={user?.profile?.profilePhoto}
                                    alt={user?.fullname || "User"}
                                />
                                <AvatarFallback className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] text-white">
                                    {user?.fullname?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h4 className="text-sm font-semibold">{user?.fullname}</h4>
                                <p className="text-xs text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                            {user && user.role === 'student' && (
                                <Link to="/profile">
                                    <Button variant="ghost" className="w-full justify-start px-3 py-2 rounded-md">
                                        <User2 className="mr-2 h-4 w-4" />
                                        View Profile
                                    </Button>
                                </Link>
                            )}
                            <Button
                                variant="ghost"
                                className="w-full justify-start px-3 py-2 rounded-md text-red-600 hover:text-red-700"
                                onClick={logoutHandler}
                                disabled={isLoggingOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 pt-4 border-t flex flex-col gap-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full border-[#6A38C2] text-[#6A38C2]">
                                Login
                            </Button>
                        </Link>
                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6]">
                                Signup
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};


export default Navbar;
