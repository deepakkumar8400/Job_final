import React, { useState } from 'react';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Building2, ChevronRight } from 'lucide-react';

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  
  // Format salary display
  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    return `₹${salary} LPA`;
  };
  
  // Calculate how long ago the job was posted
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const postedDate = new Date(dateString);
    const now = new Date();
    const diffInMs = now - postedDate;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };
  
  // Truncate long descriptions
  const truncateDescription = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      onClick={() => navigate(`/description/${job._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`p-6 rounded-xl bg-white border border-gray-200 cursor-pointer transition-all duration-300 ${
        isHovered ? 'shadow-lg border-blue-200 transform -translate-y-1' : 'shadow-md'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
            <Building2 className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-gray-900">{job?.company?.name}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job?.location || 'India'}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-400">
          <Clock className="h-4 w-4 mr-1" />
          <span>{getTimeAgo(job?.createdAt)}</span>
        </div>
      </div>
      
      <div className="mb-5">
        <h1 className="font-bold text-xl text-gray-900 mb-2">{job?.title}</h1>
        <p className="text-gray-600 leading-relaxed">{truncateDescription(job?.description)}</p>
      </div>
      
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <Badge className="bg-blue-100 text-blue-700 font-medium px-3 py-1">
          {job?.position} Positions
        </Badge>
        <Badge className="bg-orange-100 text-orange-700 font-medium px-3 py-1">
          {job?.jobType}
        </Badge>
        <Badge className="bg-purple-100 text-purple-700 font-medium px-3 py-1">
          {formatSalary(job?.salary)}
        </Badge>
        {job?.remote && (
          <Badge className="bg-green-100 text-green-700 font-medium px-3 py-1">
            Remote
          </Badge>
        )}
      </div>
      
      <div className={`flex justify-between items-center pt-4 border-t border-gray-100 transition-opacity duration-300 ${
        isHovered ? 'opacity-100' : 'opacity-70'
      }`}>
        <span className="text-sm font-medium text-blue-600">View details</span>
        <ChevronRight className={`h-5 w-5 text-blue-600 transition-transform duration-300 ${
          isHovered ? 'transform translate-x-1' : ''
        }`} />
      </div>
    </div>
  );
};

export default LatestJobCards;