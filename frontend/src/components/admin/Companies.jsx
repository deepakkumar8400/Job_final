import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import CompaniesTable from './CompaniesTable';
import { useNavigate } from 'react-router-dom';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchCompanyByText } from '@/redux/companySlice';
import { Plus, Search, X, Building2, Users, MapPin, Globe } from 'lucide-react';

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState("table");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const companies = useSelector(state => state.company.companies);
  const filteredCompanies = useSelector(state => {
    const searchText = state.company.searchCompanyByText.toLowerCase();
    if (!searchText) return state.company.companies;
    
    return state.company.companies.filter(company => 
      company.name.toLowerCase().includes(searchText) ||
      (company.industry && company.industry.toLowerCase().includes(searchText)) ||
      (company.location && company.location.toLowerCase().includes(searchText))
    );
  });

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  const clearSearch = () => {
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col sm:flex-row items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Company Directory</h1>
            <p className='text-gray-600 mt-2'>
              {filteredCompanies.length} {filteredCompanies.length === 1 ? 'company' : 'companies'} found
              {input && ` for "${input}"`}
            </p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <Button 
              variant={viewMode === "grid" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              Grid View
            </Button>
            <Button 
              variant={viewMode === "table" ? "default" : "outline"} 
              size="sm"
              onClick={() => setViewMode("table")}
            >
              Table View
            </Button>
            <Button 
              onClick={() => navigate("/admin/companies/create")}
              className="ml-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Company
            </Button>
          </div>
        </div>
        
        <div className='bg-white rounded-lg shadow p-6'>
          <div className='flex flex-col sm:flex-row items-center justify-between mb-6'>
            <div className="relative w-full sm:w-96 mb-4 sm:mb-0">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                className="pl-10 pr-10"
                placeholder="Search companies by name, industry, or location..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              {input && (
                <X 
                  className="absolute right-3 top-3 h-4 w-4 text-gray-500 cursor-pointer" 
                  onClick={clearSearch}
                />
              )}
            </div>
            {/* The filter button and related state/imports have been removed. */}
          </div>
          
          {viewMode === "table" ? (
            <CompaniesTable companies={filteredCompanies} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {filteredCompanies.map((company) => (
                <div key={company._id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{company.name}</h3>
                        <p className="text-sm text-gray-500">{company.industry || "No industry specified"}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {company.size && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {company.size} employees
                      </div>
                    )}
                    
                    {company.location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {company.location}
                      </div>
                    )}
                    
                    {company.website && (
                      <div className="flex items-center text-sm text-blue-600">
                        <Globe className="h-4 w-4 mr-2" />
                        <a href={company.website} target="_blank" rel="noopener noreferrer">
                          Visit website
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Added {new Date(company.createdAt).toLocaleDateString()}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
              
              {filteredCompanies.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No companies found</h3>
                  <p className="text-gray-500 mt-2">
                    {input 
                      ? `No results for "${input}"` 
                      : "Get started by creating your first company."
                    }
                  </p>
                  {!input && (
                    <Button 
                      onClick={() => navigate("/admin/companies/create")}
                      className="mt-4"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      New Company
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Companies;