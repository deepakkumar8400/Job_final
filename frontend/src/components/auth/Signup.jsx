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
import { Loader2, UserPlus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null
  });

  const { loading, user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value) => {
    setInput(prev => ({ ...prev, role: value }));
  };

  const changeFileHandler = (e) => {
    setInput(prev => ({ ...prev, file: e.target.files?.[0] }));
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in input) {
      if (input[key]) formData.append(key, input[key]);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Registration successful. Please login.");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className='flex flex-col min-h-screen bg-gray-50'>
      <Navbar />
      <div className='flex items-center justify-center flex-1 p-4'>
        <Card className='w-full max-w-lg mx-auto shadow-lg rounded-xl'>
          <CardHeader className='space-y-1 text-center'>
            <div className="flex justify-center items-center gap-2 mb-2">
              <UserPlus className="h-8 w-8 text-blue-600" />
              <CardTitle className='text-3xl font-bold'>Sign Up</CardTitle>
            </div>
            <CardDescription>Create a new account to get started.</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={submitHandler} className='space-y-4'>
              <div className='space-y-2'>
                <Label>Full Name</Label>
                <Input name="fullname" value={input.fullname} onChange={changeEventHandler} required />
              </div>

              <div className='space-y-2'>
                <Label>Email</Label>
                <Input type="email" name="email" value={input.email} onChange={changeEventHandler} required />
              </div>

              <div className='space-y-2'>
                <Label>Phone Number</Label>
                <Input name="phoneNumber" value={input.phoneNumber} onChange={changeEventHandler} required />
              </div>

              <div className='space-y-2'>
                <Label>Password</Label>
                <Input type="password" name="password" value={input.password} onChange={changeEventHandler} required />
              </div>

              <div className='space-y-2'>
                <Label>Role</Label>
                <RadioGroup onValueChange={handleRoleChange} defaultValue={input.role} className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="recruiter" id="recruiter" />
                    <Label htmlFor="recruiter">Recruiter</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className='space-y-2'>
                <Label>Profile Photo (Optional)</Label>
                <Input type="file" accept="image/*" onChange={changeFileHandler} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className='animate-spin' /> : "Sign Up"}
              </Button>

              <p className='text-center text-sm'>
                Already have an account? <Link to="/login" className='text-blue-600'>Login</Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
