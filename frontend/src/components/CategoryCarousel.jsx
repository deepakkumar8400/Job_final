import React, { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Code, Database, Palette, Cpu, BarChart3, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';

const categories = [
    {
        name: "Frontend Developer",
        icon: <Code className="h-5 w-5" />,
        gradient: "from-blue-500 to-cyan-500",
        jobs: "12K+ Jobs"
    },
    {
        name: "Backend Developer",
        icon: <Database className="h-5 w-5" />,
        gradient: "from-green-500 to-emerald-500",
        jobs: "8K+ Jobs"
    },
    {
        name: "Data Science",
        icon: <BarChart3 className="h-5 w-5" />,
        gradient: "from-purple-500 to-violet-500",
        jobs: "5K+ Jobs"
    },
    {
        name: "Graphic Designer",
        icon: <Palette className="h-5 w-5" />,
        gradient: "from-pink-500 to-rose-500",
        jobs: "7K+ Jobs"
    },
    {
        name: "FullStack Developer",
        icon: <Cpu className="h-5 w-5" />,
        gradient: "from-orange-500 to-amber-500",
        jobs: "10K+ Jobs"
    },
    {
        name: "DevOps Engineer",
        icon: <Sparkles className="h-5 w-5" />,
        gradient: "from-indigo-500 to-blue-500",
        jobs: "6K+ Jobs"
    }
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(0);

    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="w-full py-16 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-[#6A38C2]/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F83002]/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
            
            <div className="max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-[#6A38C2]/10 text-[#6A38C2] px-4 py-2 rounded-full text-sm font-medium mb-4">
                        <TrendingUp className="h-4 w-4" />
                        Most Popular Categories
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002]">Job Categories</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover opportunities in various fields. Find your perfect role from thousands of available positions.
                    </p>
                </div>
                
                <Carousel 
                    opts={{ 
                        align: "start", 
                        loop: true,
                    }} 
                    className="w-full"
                    onMouseEnter={() => setActiveCategory(null)}
                >
                    <CarouselContent className="-ml-4">
                        {categories.map((category, index) => (
                            <CarouselItem 
                                key={index} 
                                className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4"
                                onMouseEnter={() => setActiveCategory(index)}
                            >
                                <div 
                                    onClick={() => searchJobHandler(category.name)}
                                    className={`group relative h-full bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-6 flex flex-col
                                        ${activeCategory === index ? 'border-[#6A38C2]/30 shadow-md scale-105' : 'border-gray-200'}`}
                                >
                                    {/* Background gradient effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300 ${category.gradient}`}></div>
                                    
                                    {/* Icon with gradient background */}
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 bg-gradient-to-r ${category.gradient} text-white`}>
                                        {category.icon}
                                    </div>
                                    
                                    {/* Category name */}
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                                        {category.name}
                                    </h3>
                                    
                                    {/* Job count */}
                                    <p className="text-sm text-gray-500 mb-5">
                                        {category.jobs}
                                    </p>
                                    
                                    {/* CTA */}
                                    <div className="mt-auto flex items-center text-sm font-medium text-gray-700 group-hover:text-[#6A38C2] transition-colors">
                                        Explore jobs
                                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                    
                                    {/* Bottom accent bar */}
                                    <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    
                    <div className="flex justify-center gap-3 mt-10">
                        <CarouselPrevious className="relative static -translate-x-0 -translate-y-0 mt-0 left-0 top-0 h-12 w-12 rounded-full border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900" />
                        <CarouselNext className="relative static -translate-x-0 -translate-y-0 mt-0 right-0 top-0 h-12 w-12 rounded-full border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:text-gray-900" />
                    </div>
                </Carousel>
                
                <div className="text-center mt-12">
                    <Button 
                        onClick={() => navigate("/browse")} 
                        className="rounded-full bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5A2CAD] hover:to-[#7C4BCC] px-8 py-6 text-base font-medium shadow-sm hover:shadow-md transition-all"
                    >
                        View All Categories
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CategoryCarousel;