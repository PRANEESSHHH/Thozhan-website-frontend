import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, Briefcase, Banknote } from 'lucide-react'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    
    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='p-6 rounded-lg shadow-sm bg-white border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer'
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                        {job?.company?.logo ? (
                            <img 
                                src={job?.company?.logo} 
                                alt={job?.company?.name} 
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <Briefcase className="h-6 w-6 text-blue-600" />
                        )}
                    </div>
                    <div>
                        <h2 className='font-medium text-lg text-gray-900'>{job?.company?.name}</h2>
                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{job?.location || 'India'}</span>
                        </div>
                    </div>
                </div>
                <Badge 
                    className={
                        job?.jobType === 'Full-Time' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 
                        job?.jobType === 'Part-Time' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' :
                        'bg-green-100 text-green-700 hover:bg-green-100'
                    }
                >
                    {job?.jobType}
                </Badge>
            </div>
            
            <div className="mt-4">
                <h1 className='font-bold text-xl text-gray-900 mb-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
            </div>
            
            <div className='flex flex-wrap items-center gap-3 mt-5 text-sm'>
                <div className="flex items-center text-gray-700">
                    <Briefcase className="h-4 w-4 mr-1 text-blue-500" />
                    <span>{job?.position} Position{job?.position > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    <span>Urgent Hiring</span>
                </div>
                <div className="flex items-center text-gray-700">
                    <Banknote className="h-4 w-4 mr-1 text-blue-500" />
                    <span>₹{job?.salary} LPA</span>
                </div>
            </div>
        </div>
    )
}

export default LatestJobCards