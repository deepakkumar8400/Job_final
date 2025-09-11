import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Filter, X, MapPin, Building, DollarSign } from 'lucide-react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'

const filterData = [
  {
    filterType: "Location",
    icon: MapPin,
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
  },
  {
    filterType: "Industry",
    icon: Building,
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
  },
  {
    filterType: "Salary",
    icon: DollarSign,
    array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
  },
]

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();
  
  const changeHandler = (value) => {
    setSelectedValue(value);
  }

  const clearFilter = () => {
    setSelectedValue('');
  }

  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue, dispatch]);

  return (
    <div className='w-full bg-white p-5 rounded-lg shadow-md border border-gray-100'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Filter className='h-5 w-5 text-[#7209b7]' />
          <h1 className='font-bold text-xl text-gray-800'>Filter Jobs</h1>
        </div>
        
        {selectedValue && (
          <Badge 
            variant="outline" 
            className="bg-[#7209b7] text-white px-2 py-1 cursor-pointer hover:bg-[#5f32ad]"
            onClick={clearFilter}
          >
            Clear
            <X className="h-3 w-3 ml-1" />
          </Badge>
        )}
      </div>
      
      {selectedValue && (
        <div className='mb-4 p-3 bg-purple-50 rounded-md border border-purple-100'>
          <p className='text-sm text-gray-600'>Active filter:</p>
          <div className='flex items-center mt-1'>
            <Badge className='bg-[#7209b7] text-white'>
              {selectedValue}
            </Badge>
          </div>
        </div>
      )}
      
      <div className='lg:hidden mb-4'>
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span>{isExpanded ? 'Hide Filters' : 'Show Filters'}</span>
          <Filter className='h-4 w-4' />
        </Button>
      </div>
      
      <div className={`${isExpanded ? 'block' : 'hidden'} lg:block`}>
        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
          {filterData.map((data, index) => {
            const IconComponent = data.icon;
            return (
              <div key={index} className='mb-6 last:mb-0'>
                <div className='flex items-center gap-2 mb-3'>
                  <IconComponent className='h-4 w-4 text-[#7209b7]' />
                  <h2 className='font-semibold text-gray-700'>{data.filterType}</h2>
                </div>
                
                <div className='space-y-2 pl-6'>
                  {data.array.map((item, idx) => {
                    const itemId = `id${index}-${idx}`
                    return (
                      <div key={itemId} className='flex items-center space-x-3 py-1'>
                        <RadioGroupItem 
                          value={item} 
                          id={itemId} 
                          className="text-[#7209b7] border-gray-300 data-[state=checked]:border-[#7209b7]" 
                        />
                        <Label 
                          htmlFor={itemId} 
                          className="text-gray-700 cursor-pointer hover:text-[#7209b7] transition-colors"
                        >
                          {item}
                        </Label>
                      </div>
                    )
                  })}
                </div>
                
                {index < filterData.length - 1 && (
                  <hr className='mt-4 border-gray-100' />
                )}
              </div>
            )
          })}
        </RadioGroup>
      </div>
    </div>
  )
}

export default FilterCard