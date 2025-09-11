import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion, AnimatePresence } from 'framer-motion';

const Browse = () => {
    useGetAllJobs();
    const dispatch = useDispatch();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filteredJobs, setFilteredJobs] = useState(allJobs);
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    // Simulate loading state
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Filter jobs based on search query
    useEffect(() => {
        if (searchedQuery) {
            const filtered = allJobs.filter((job) => {
                return (
                    job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.location.toLowerCase().includes(searchedQuery.toLowerCase())
                );
            });
            setFilteredJobs(filtered);
        } else {
            setFilteredJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    // Clear search query when component unmounts
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);

    // Toggle filters on mobile
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
                        <p className="text-gray-600 mt-2">
                            {searchedQuery 
                                ? `Search results for "${searchedQuery}" (${filteredJobs.length} jobs found)`
                                : `Browse all available positions (${filteredJobs.length} jobs)`
                            }
                        </p>
                    </div>
                    
                    <button
                        onClick={toggleFilters}
                        className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 md:hidden"
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                        <svg className="ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    {/* Filters Sidebar - Hidden on mobile unless toggled */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-1/4`}>
                        <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                            <FilterCard />
                        </div>
                    </div>

                    {/* Jobs Listings */}
                    <div className="w-full md:w-3/4">
                        {loading ? (
                            // Loading skeleton
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="bg-white rounded-lg shadow p-6 animate-pulse">
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                                        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredJobs.length === 0 ? (
                            // No jobs found state
                            <div className="bg-white rounded-lg shadow p-8 text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
                                <p className="mt-2 text-gray-500">
                                    {searchedQuery 
                                        ? `We couldn't find any jobs matching "${searchedQuery}". Try adjusting your search.`
                                        : "There are currently no job openings available. Please check back later."
                                    }
                                </p>
                            </div>
                        ) : (
                            // Jobs grid with animations
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                <AnimatePresence>
                                    {filteredJobs.map((job) => (
                                        <motion.div
                                            key={job._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.3 }}
                                            layout
                                        >
                                            <Job job={job} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Browse;