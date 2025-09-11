import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, FileText } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    const isResume = user?.profile?.resume;

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto my-8 p-6 sm:p-8 bg-white border border-gray-200 rounded-3xl shadow-lg'>
                <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6'>
                    <Avatar className='h-28 w-28 border-2 border-gray-300'>
                        <AvatarImage src={user?.profile?.profilePhoto || "https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg"} alt='profile' />
                        <AvatarFallback>
                            {user?.fullname ? user.fullname.substring(0, 2).toUpperCase() : 'NA'}
                        </AvatarFallback>
                    </Avatar>
                    <div className='flex-grow text-center sm:text-left'>
                        <div className='flex items-center justify-center sm:justify-between flex-wrap gap-2'>
                            <h1 className='text-3xl font-bold text-gray-800'>{user?.fullname}</h1>
                            <Button onClick={() => setOpen(true)} variant='ghost' className='text-gray-500 hover:text-blue-600 p-2 rounded-full transition-colors'>
                                <Pen size={20} />
                            </Button>
                        </div>
                        <p className='text-gray-600 mt-2 text-md italic'>{user?.profile?.bio || 'Bio not provided.'}</p>
                        <div className='flex flex-col gap-2 mt-4 text-gray-700'>
                            <div className='flex items-center gap-2'>
                                <Mail size={18} className='text-blue-500' />
                                <span>{user?.email}</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <Contact size={18} className='text-green-500' />
                                <span>{user?.phoneNumber || 'Phone number not provided'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className='my-8 border-gray-200' />

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                    <div>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>Skills</h2>
                        <div className='flex flex-wrap items-center gap-2'>
                            {user?.profile?.skills?.length > 0 ? (
                                user.profile.skills.map((item, index) => (
                                    <Badge key={index} className='bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors'>
                                        {item}
                                    </Badge>
                                ))
                            ) : (
                                <span className='text-gray-500'>No skills added.</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className='text-xl font-semibold text-gray-800 mb-3'>Resume</h2>
                        <div className='flex items-center gap-2'>
                            {isResume ? (
                                <a target='_blank' rel='noopener noreferrer' href={user.profile.resume} className='text-blue-600 flex items-center gap-1 hover:underline transition-colors'>
                                    <FileText size={18} />
                                    {user.profile.resumeOriginalName || 'View Resume'}
                                </a>
                            ) : (
                                <span className='text-gray-500'>No resume uploaded.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='max-w-4xl mx-auto my-8 p-6 sm:p-8 bg-white border border-gray-200 rounded-3xl shadow-lg'>
                <h1 className='text-2xl font-bold text-gray-800 mb-6'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>
            
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;