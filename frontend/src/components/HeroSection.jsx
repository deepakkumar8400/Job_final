import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search, Sparkles, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        if (query.trim()) {
            dispatch(setSearchedQuery(query.trim()));
            navigate("/browse");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    };
    
    // Framer Motion variants for animations
    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, duration: 0.6 } }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    };
    
    return (
        <section className="relative text-center overflow-hidden py-24 md:py-32 bg-gray-50">
            {/* Background elements with subtle glow */}
            <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 -z-10"></div>
            <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl -z-10 animate-blob"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl -z-10 animate-blob animation-delay-2000"></div>

            <motion.div 
                className="flex flex-col gap-6 px-4 max-w-4xl mx-auto z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Trust Badges */}
                <motion.div 
                    className="flex items-center justify-center gap-3 flex-wrap"
                    variants={itemVariants}
                >
                    <span className="px-4 py-2 rounded-full bg-white text-purple-600 font-medium border border-gray-200 shadow-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        No. 1 Job Platform
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-600 font-medium text-sm flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        10K+ Hired This Month
                    </span>
                </motion.div>

                {/* Heading and Subtitle */}
                <motion.h1 
                    className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900"
                    variants={itemVariants}
                >
                    Find Your <br className="md:hidden" />
                    <span className="relative">
                        <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            Dream Job
                        </span>
                        <span className="absolute bottom-2 left-0 w-full h-3 bg-purple-400/30 -z-0"></span>
                    </span>
                    , Faster.
                </motion.h1>

                <motion.p 
                    className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
                    variants={itemVariants}
                >
                    Discover thousands of job opportunities from top companies worldwide.
                    Your next career move is just a search away.
                </motion.p>

                {/* Search Bar and Button */}
                <motion.div 
                    className={`flex w-full max-w-2xl shadow-lg border transition-all duration-300 transform rounded-full items-center gap-2 mx-auto bg-white 
                    ${isFocused ? 'border-purple-600/50 shadow-purple-600/20 scale-[1.01]' : 'border-gray-200'} p-1.5 md:p-2`}
                    variants={itemVariants}
                >
                    <Search className="h-5 w-5 text-gray-400 ml-4" />
                    <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="outline-none border-none w-full py-2 text-base md:text-lg placeholder-gray-400 flex-1"
                    />
                    <Button
                        onClick={searchJobHandler}
                        className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-12 px-6 gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-purple-600/30 font-semibold"
                        disabled={!query.trim()}
                    >
                        Search
                        <ArrowRight className="h-5 w-5" />
                    </Button>
                </motion.div>

                {/* Popular Search Tags */}
                <motion.div 
                    className="flex flex-wrap items-center justify-center gap-2 mt-4 text-sm text-gray-500"
                    variants={itemVariants}
                >
                    <span className="font-semibold text-gray-700">Popular Searches:</span>
                    {['Developer', 'Designer', 'Marketing', 'Remote', 'Manager'].map((tag, index) => (
                        <Button
                            key={index}
                            onClick={() => setQuery(tag)}
                            variant="outline"
                            className="rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 h-8 px-4"
                        >
                            {tag}
                        </Button>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;