import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Award, Briefcase, Contact, Download, Mail, MapPin, Pen } from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import AppliedJobTable from './AppliedJobTable'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Label } from './ui/label'
import UpdateProfileDialog from './UpdateProfileDialog'

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store=>store.auth);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Profile Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 h-32"></div>
                    
                    <div className="px-8 pb-8 -mt-16">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                <Avatar className="h-28 w-28 border-4 border-white shadow-md">
                                    <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                                </Avatar>
                                
                                <div className="text-center md:text-left mt-4 md:mt-0">
                                    <h1 className="font-bold text-2xl text-gray-900">{user?.fullname}</h1>
                                    <p className="text-gray-600 mt-1">{user?.profile?.bio || "No bio added yet"}</p>
                                    
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                                        {user?.profile?.location && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <MapPin size={16} className="mr-1" />
                                                {user.profile.location}
                                            </div>
                                        )}
                                        
                                        {user?.profile?.currentPosition && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Briefcase size={16} className="mr-1" />
                                                {user.profile.currentPosition}
                                            </div>
                                        )}
                                        
                                        {user?.profile?.experience && (
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Award size={16} className="mr-1" />
                                                {user.profile.experience} years experience
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <Button 
                                onClick={() => setOpen(true)} 
                                className="mt-6 md:mt-0 self-center"
                                variant="outline"
                                size="sm"
                            >
                                <Pen size={16} className="mr-2" />
                                Edit Profile
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-700">
                                    <Mail size={18} className="mr-3 text-gray-500" />
                                    <span>{user?.email}</span>
                                </div>
                                
                                <div className="flex items-center text-gray-700">
                                    <Contact size={18} className="mr-3 text-gray-500" />
                                    <span>{user?.phoneNumber || "Not provided"}</span>
                                </div>
                                
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Resume</Label>
                                    <div className="mt-1">
                                        {user?.profile?.resume ? (
                                            <a 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                href={user.profile.resume} 
                                                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                                            >
                                                <Download size={16} className="mr-1" />
                                                {user.profile.resumeOriginalName || "Download Resume"}
                                            </a>
                                        ) : (
                                            <span className="text-gray-500">No resume uploaded</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user?.profile?.skills?.length > 0 ? (
                                        user.profile.skills.map((item, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="secondary"
                                                className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1"
                                            >
                                                {item}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-gray-500">No skills added yet</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Applied Jobs Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-xl text-gray-900">Applied Jobs</h2>
                        <span className="text-sm text-gray-500">
                            {user?.appliedJobs?.length || 0} applications
                        </span>
                    </div>
                    
                    <AppliedJobTable />
                </div>
            </div>
            
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile