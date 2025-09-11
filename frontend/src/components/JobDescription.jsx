import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { MapPin, Calendar, Users, DollarSign, Briefcase, ArrowLeft, Building2, Bookmark, Share2, CheckCircle } from 'lucide-react'

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job)
    const { user } = useSelector(store => store.auth)
    const isIntiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false
    const [isApplied, setIsApplied] = useState(isIntiallyApplied)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isSharing, setIsSharing] = useState(false)
    const [isSaved, setIsSaved] = useState(false)

    const params = useParams()
    const jobId = params.id
    const dispatch = useDispatch()

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true })
            
            if (res.data.success) {
                setIsApplied(true)
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] }
                dispatch(setSingleJob(updatedSingleJob))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        }
    }

    const saveJobHandler = async () => {
        setIsSaving(true)
        try {
            // Simulate API call to save job
            await new Promise(resolve => setTimeout(resolve, 1000))
            setIsSaved(!isSaved)
            toast.success(isSaved ? 'Job removed from saved jobs!' : 'Job saved successfully!')
        } catch (error) {
            toast.error('Failed to save job')
        } finally {
            setIsSaving(false)
        }
    }

    const shareJobHandler = async () => {
        setIsSharing(true)
        try {
            if (navigator.share) {
                await navigator.share({
                    title: singleJob?.title,
                    text: singleJob?.description,
                    url: window.location.href,
                })
            } else {
                await navigator.clipboard.writeText(window.location.href)
                toast.success('Link copied to clipboard!')
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsSharing(false)
        }
    }

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                setIsLoading(true)
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job))
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id))
                }
            } catch (error) {
                console.log(error)
                toast.error('Failed to load job details')
            } finally {
                setIsLoading(false)
            }
        }
        fetchSingleJob()
    }, [jobId, dispatch, user?._id])

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6 mb-2"></div>
                </div>
            </div>
        )
    }

    if (!singleJob) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
                <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or may have been removed.</p>
                <Link to="/jobs">
                    <Button className="bg-[#7209b7] hover:bg-[#5f32ad]">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto my-10 px-4">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-[#7209b7]">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/jobs" className="hover:text-[#7209b7]">Jobs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-800">{singleJob.title}</span>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Job Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-r from-[#6A38C2] to-[#8A54D6] rounded-lg flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-2xl text-gray-900">{singleJob.title}</h1>
                                    <p className="text-gray-600">{singleJob.company?.name || 'TechCorp Inc.'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                className={`rounded-lg flex items-center gap-2 ${isApplied ? 'bg-green-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                                size="lg"
                            >
                                {isApplied ? (
                                    <>
                                        <CheckCircle className="h-5 w-5" /> Applied
                                    </>
                                ) : (
                                    'Apply Now'
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={saveJobHandler}
                                disabled={isSaving}
                                className={`rounded-lg flex items-center gap-2 ${isSaved ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
                            >
                                <Bookmark 
                                    className={`h-5 w-5 ${isSaving ? 'animate-pulse' : ''} ${isSaved ? 'fill-blue-600 text-blue-600' : ''}`} 
                                />
                                {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={shareJobHandler}
                                disabled={isSharing}
                                className="rounded-lg flex items-center gap-2"
                            >
                                <Share2 className={`h-5 w-5 ${isSharing ? 'animate-pulse' : ''}`} />
                                Share
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-6">
                        <Badge className="bg-blue-100 text-blue-700 font-bold flex items-center gap-1">
                            <Briefcase className="h-4 w-4" /> {singleJob.position} Positions
                        </Badge>
                        <Badge className="bg-red-100 text-red-700 font-bold flex items-center gap-1">
                            <Briefcase className="h-4 w-4" /> {singleJob.jobType}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-700 font-bold flex items-center gap-1">
                            <DollarSign className="h-4 w-4" /> {singleJob.salary}LPA
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 font-bold flex items-center gap-1">
                            <MapPin className="h-4 w-4" /> {singleJob.location || 'India'}
                        </Badge>
                    </div>
                </div>

                {/* Job Details */}
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Job Description</h2>
                        
                        <div className="prose max-w-none mb-6">
                            <p className="text-gray-700">{singleJob.description}</p>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                        <ul className="list-disc pl-5 text-gray-700 mb-6 space-y-2">
                            <li>Bachelor's degree in Computer Science or related field</li>
                            <li>{singleJob.experience || 0}+ years of relevant experience</li>
                            <li>Strong problem-solving skills and attention to detail</li>
                            <li>Excellent communication and teamwork abilities</li>
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Responsibilities</h3>
                        <ul className="list-disc pl-5 text-gray-700 space-y-2">
                            <li>Design, develop, and maintain software applications</li>
                            <li>Collaborate with cross-functional teams to define and design new features</li>
                            <li>Identify and correct bottlenecks and fix bugs</li>
                            <li>Help maintain code quality, organization, and automatization</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Overview</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Posted Date</p>
                                        <p className="font-medium">{singleJob.createdAt ? singleJob.createdAt.split("T")[0] : 'Not specified'}</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Briefcase className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Experience</p>
                                        <p className="font-medium">{singleJob.experience || 0} yrs</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <DollarSign className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Salary</p>
                                        <p className="font-medium">{singleJob.salary || 'Not disclosed'} LPA</p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Users className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Applicants</p>
                                        <p className="font-medium">{singleJob.applications?.length || 0}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">About Company</h3>
                                <p className="text-gray-700">
                                    {singleJob.company?.description || 'A leading technology company focused on innovation and excellence in software development.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription