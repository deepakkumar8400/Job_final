import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [isFilterVisible, setIsFilterVisible] = useState(false);

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
            })
            setFilterJobs(filteredJobs)
        } else {
            setFilterJobs(allJobs)
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Mobile filter toggle button */}
            <div className="lg:hidden fixed bottom-6 right-6 z-30">
                <button 
                    onClick={() => setIsFilterVisible(!isFilterVisible)}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                    aria-label="Toggle filters"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                </button>
            </div>

            <div className="max-w-7xl mx-auto mt-5 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-5">
                    {/* Filter sidebar - hidden on mobile by default */}
                    <div className={`${isFilterVisible ? 'block' : 'hidden'} lg:block lg:w-1/4 fixed lg:static inset-0 z-20 bg-white lg:bg-transparent overflow-y-auto lg:overflow-visible`}>
                        <div className="p-4 lg:p-0">
                            <div className="flex justify-between items-center mb-4 lg:hidden">
                                <h2 className="text-xl font-bold">Filters</h2>
                                <button 
                                    onClick={() => setIsFilterVisible(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                    aria-label="Close filters"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <FilterCard />
                        </div>
                    </div>
                    
                    {/* Overlay for mobile when filter is visible */}
                    {isFilterVisible && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                            onClick={() => setIsFilterVisible(false)}
                        ></div>
                    )}

                    {/* Jobs list */}
                    {
                        filterJobs.length <= 0 ? (
                            <div className="flex-1 flex items-center justify-center py-10">
                                <span className="text-xl text-gray-500">No jobs found</span>
                            </div>
                        ) : (
                            <div className='flex-1 min-h-[70vh] lg:h-[88vh] overflow-y-auto pb-5'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {
                                        filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}
                                                className="w-full"
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))
                                    }
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Jobs;