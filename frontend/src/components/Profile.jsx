// Profile.jsx (Frontend Component)
import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Upload, FileText, X, Download, AlertCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [parsing, setParsing] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [showParsedData, setShowParsedData] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useSelector(store=>store.auth);

    // Function to handle file upload and parsing using Adobe PDF Services API
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file || file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        setParsing(true);
        setError(null);
        
        try {
            // Create form data to send to our proxy server
            const formData = new FormData();
            formData.append('file', file);
            
            // Call our backend API endpoint
            const response = await fetch('/api/parse-resume', {
                method: 'POST',
                body: formData,
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to parse resume');
            }
            
            const data = await response.json();
            setParsedData(data);
            setShowParsedData(true);
        } catch (error) {
            console.error('Error parsing resume:', error);
            setError(error.message || 'Failed to parse resume. Please try again.');
        } finally {
            setParsing(false);
        }
    };

    // Function to simulate parsing (for demo purposes)
    const handleDemoParse = () => {
        setParsing(true);
        setError(null);
        
        // Simulate API call delay
        setTimeout(() => {
            const demoData = {
                contact: {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    phone: "+1 (555) 123-4567",
                    location: "San Francisco, CA"
                },
                skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB", "AWS"],
                experience: [
                    {
                        title: "Senior Frontend Developer",
                        company: "TechCorp Inc.",
                        startDate: "Jan 2020",
                        endDate: "Present",
                        description: "Led a team of developers to build responsive web applications."
                    },
                    {
                        title: "Web Developer",
                        company: "StartUp Solutions",
                        startDate: "Jun 2017",
                        endDate: "Dec 2019",
                        description: "Developed and maintained client websites and web applications."
                    }
                ],
                education: [
                    {
                        degree: "B.S. in Computer Science",
                        institution: "University of Technology",
                        year: "2017",
                        gpa: "3.8"
                    }
                ]
            };
            
            setParsedData(demoData);
            setShowParsedData(true);
            setParsing(false);
        }, 2000);
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1 className="font-semibold mb-2">Skills</h1>
                    <div className='flex items-center gap-1 flex-wrap'>
                        {
                            user?.profile?.skills && user.profile.skills.length !== 0 ? 
                            user.profile.skills.map((item, index) => <Badge key={index} variant="secondary" className="mb-1">{item}</Badge>) : 
                            <span className="text-gray-500">No skills added yet</span>
                        }
                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>
                    {user?.profile?.resume ? (
                        <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer flex items-center'>
                            <FileText className="mr-2 h-4 w-4" />
                            {user?.profile?.resumeOriginalName}
                        </a>
                    ) : (
                        <span className="text-gray-500">No resume uploaded</span>
                    )}
                    
                    {/* Resume Parser Section */}
                    <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                        <h2 className="text-lg font-semibold mb-2">Parse Your Resume</h2>
                        <p className="text-sm text-gray-600 mb-3">
                            Upload your resume to automatically extract skills and experience
                        </p>
                        
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 border-gray-300">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PDF only (MAX. 10MB)</p>
                            </div>
                            <input 
                                type="file" 
                                className="hidden" 
                                accept=".pdf" 
                                onChange={handleFileUpload}
                                disabled={parsing}
                            />
                        </label>
                        
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-500 mb-2">Don't have a resume to test with?</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleDemoParse}
                                disabled={parsing}
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Try with sample data
                            </Button>
                        </div>
                        
                        {parsing && (
                            <div className="mt-4 text-blue-500 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
                                Parsing your resume...
                            </div>
                        )}
                        
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-red-700 text-sm">{error}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Parsed Resume Data Display */}
            {showParsedData && parsedData && (
                <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 relative">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-4 right-4" 
                        onClick={() => setShowParsedData(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    
                    <h2 className="text-xl font-bold mb-4 flex items-center">
                        <FileText className="mr-2" />
                        Parsed Resume Information
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        {parsedData.contact && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Contact Information</h3>
                                {parsedData.contact.name && <p><strong>Name:</strong> {parsedData.contact.name}</p>}
                                {parsedData.contact.email && <p><strong>Email:</strong> {parsedData.contact.email}</p>}
                                {parsedData.contact.phone && <p><strong>Phone:</strong> {parsedData.contact.phone}</p>}
                                {parsedData.contact.location && <p><strong>Location:</strong> {parsedData.contact.location}</p>}
                            </div>
                        )}
                        
                        {/* Skills */}
                        {parsedData.skills && parsedData.skills.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Skills</h3>
                                <div className="flex flex-wrap gap-1">
                                    {parsedData.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Experience */}
                    {parsedData.experience && parsedData.experience.length > 0 && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Experience</h3>
                            {parsedData.experience.map((exp, index) => (
                                <div key={index} className="mb-3">
                                    <p><strong>{exp.title}</strong> at {exp.company}</p>
                                    <p className="text-sm text-gray-600">
                                        {exp.startDate} - {exp.endDate || 'Present'}
                                    </p>
                                    {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Education */}
                    {parsedData.education && parsedData.education.length > 0 && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-2">Education</h3>
                            {parsedData.education.map((edu, index) => (
                                <div key={index} className="mb-3">
                                    <p><strong>{edu.degree}</strong> - {edu.institution}</p>
                                    <p className="text-sm text-gray-600">
                                        {edu.year} {edu.gpa && ` | GPA: ${edu.gpa}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="mt-6 flex justify-end space-x-2">
                        <Button 
                            variant="outline"
                            onClick={() => setShowParsedData(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={() => {
                                // Add logic to save parsed data to profile
                                alert('This would save the parsed data to your profile');
                            }}
                        >
                            Save to Profile
                        </Button>
                    </div>
                </div>
            )}
            
            <div className='max-w-4xl mx-auto bg-white rounded-2xl p-8'>
                <h1 className='font-bold text-lg mb-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen}/>
        </div>
    )
}

export default Profile;