import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { Filter, MapPin, Briefcase, Banknote, Clock } from 'lucide-react'
import { Button } from './ui/button'

const filterData = [
    {
        filterType: "Location",
        icon: <MapPin className="h-4 w-4 text-blue-600 mr-2" />,
        array: ["Delhi NCR", "Mumbai", "Chennai", "Bangalore", "Hyderabad", "Pune", "Kolkata"]
    },
    {
        filterType: "Job Type",
        icon: <Clock className="h-4 w-4 text-blue-600 mr-2" />,
        array: ["Full-Time", "Part-Time", "Contract", "Temporary", "Apprenticeship"]
    },
    {
        filterType: "Category",
        icon: <Briefcase className="h-4 w-4 text-blue-600 mr-2" />,
        array: ["Construction", "Drivers", "Mechanics", "Electricians", "Manufacturing", "Carpenters", "Painters", "Plumbers", "Security"]
    },
    {
        filterType: "Salary",
        icon: <Banknote className="h-4 w-4 text-blue-600 mr-2" />,
        array: ["₹10K-20K/month", "₹20K-30K/month", "₹30K-40K/month", "₹40K-50K/month", "Above ₹50K/month"]
    },
]

const FilterCard = () => {
    const [selectedValue, setSelectedValue] = useState('');
    const dispatch = useDispatch();
    
    const changeHandler = (value) => {
        setSelectedValue(value);
    }
    
    const clearFilters = () => {
        setSelectedValue('');
        dispatch(setSearchedQuery(''));
    }
    
    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue, dispatch]);
    
    return (
        <div className='w-full bg-white p-5 rounded-lg shadow-sm border border-gray-200 sticky top-20'>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <Filter className="h-5 w-5 text-blue-600 mr-2" />
                    <h1 className='font-bold text-lg text-gray-900'>Filter Jobs</h1>
                </div>
                {selectedValue && (
                    <Button 
                        variant="ghost" 
                        onClick={clearFilters}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-auto"
                    >
                        Clear filters
                    </Button>
                )}
            </div>
            
            <div className="space-y-6">
                <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                    {filterData.map((data, index) => (
                        <div key={data.filterType} className="pb-4 border-b border-gray-100 last:border-0">
                            <div className="flex items-center mb-3">
                                {data.icon}
                                <h2 className='font-semibold text-gray-800'>{data.filterType}</h2>
                            </div>
                            <div className="space-y-2 pl-2">
                                {data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`;
                                    return (
                                        <div key={itemId} className='flex items-center space-x-2 py-1'>
                                            <RadioGroupItem value={item} id={itemId} className="text-blue-600" />
                                            <Label 
                                                htmlFor={itemId} 
                                                className={`text-sm cursor-pointer ${selectedValue === item ? 'font-medium text-blue-700' : 'text-gray-600'}`}
                                            >
                                                {item}
                                            </Label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </div>
    )
}

export default FilterCard