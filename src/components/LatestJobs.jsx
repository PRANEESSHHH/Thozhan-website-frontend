import React from 'react'
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux'; 
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();
   
    return (
        <div className='bg-white py-16'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex justify-between items-center mb-8'>
                    <div>
                        <h2 className='text-3xl font-bold text-gray-900'>Latest Job Openings</h2>
                        <p className='text-gray-600 mt-2'>Find opportunities that match your skills and experience</p>
                    </div>
                    <Button 
                        onClick={() => navigate('/jobs')}
                        variant="outline" 
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                        View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                
                {allJobs.length <= 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-700">No jobs available at the moment</h3>
                        <p className="text-gray-500 mt-2">Check back soon for new opportunities</p>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-5'>
                        {allJobs?.slice(0, 6).map((job) => (
                            <LatestJobCards key={job._id} job={job} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default LatestJobs