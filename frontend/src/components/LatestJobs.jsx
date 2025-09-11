import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();

    return (
        <div className='max-w-7xl mx-auto px-4 py-16'>
            {/* Header Section */}
            <div className='text-center mb-12'>
                <div className='inline-flex items-center gap-2 bg-[#6A38C2]/10 text-[#6A38C2] px-4 py-2 rounded-full text-sm font-medium mb-4'>
                    <Sparkles className='h-4 w-4' />
                    Featured Opportunities
                </div>
                <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]'>Latest & Top </span> 
                    Job Openings
                </h1>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                    Discover the most recent and exciting career opportunities from top companies around the world.
                </p>
            </div>

            {/* Jobs Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
                {
                    allJobs.length <= 0 ? (
                        <div className='col-span-full text-center py-12'>
                            <div className='bg-gray-100 rounded-2xl p-8 max-w-md mx-auto'>
                                <div className='bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4'>
                                    <Sparkles className='h-8 w-8 text-gray-500' />
                                </div>
                                <h3 className='text-xl font-semibold text-gray-700 mb-2'>No Jobs Available</h3>
                                <p className='text-gray-500'>Check back later for new opportunities</p>
                            </div>
                        </div>
                    ) : allJobs?.slice(0, 6).map((job) => (
                        <LatestJobCards key={job._id} job={job} />
                    ))
                }
            </div>

            {/* View All Button */}
            {allJobs.length > 0 && (
                <div className='text-center'>
                    <Button 
                        onClick={() => navigate('/browse')}
                        className='rounded-full bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5A2CAD] hover:to-[#7C4BCC] px-8 py-6 text-base font-medium shadow-sm hover:shadow-md transition-all group'
                    >
                        View All Job Opportunities
                        <ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
                    </Button>
                </div>
            )}
        </div>
    )
}

export default LatestJobs