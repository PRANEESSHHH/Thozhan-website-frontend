import React from 'react'
import { Button } from './ui/button'
import { Bookmark, MapPin, Clock, Briefcase, Banknote, ExternalLink, Phone } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import useSavedJobs from '@/hooks/useSavedJobs'
import { useSelector } from 'react-redux'

const Job = ({job}) => {
    const navigate = useNavigate();
    const { isJobSaved, toggleJobSaved } = useSavedJobs();
    const { user } = useSelector(store => store.auth);
    
    const isSaved = isJobSaved(job?._id);
    
    // Handle save/unsave job
    const handleSaveJob = (e) => {
        e.stopPropagation();
        if (user) {
            toggleJobSaved(job?._id);
        } else {
            // If user is not logged in, redirect to login page
            navigate('/login');
        }
    };

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    const getCompanyInitials = (name) => {
        if (!name) return "CO";
        const words = name.split(" ");
        if (words.length === 1) return name.slice(0, 2).toUpperCase();
        return (words[0][0] + words[1][0]).toUpperCase();
    };
    
    const getBadgeColor = (jobType) => {
        switch(jobType) {
            case 'Full-Time':
                return 'bg-primary-100 text-primary-700 hover:bg-primary-100';
            case 'Part-Time':
                return 'bg-warning-100 text-warning-700 hover:bg-warning-100';
            case 'Contract':
                return 'bg-accent-100 text-accent-700 hover:bg-accent-100';
            case 'Temporary':
                return 'bg-success-100 text-success-700 hover:bg-success-100';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };
    
    return (
        <div className='p-5 rounded-lg shadow-soft bg-white border border-gray-100 card-hover'>
            <div className='flex items-center justify-between mb-3'>
                <div className='flex items-center text-gray-500 text-sm'>
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <p>{daysAgoFunction(job?.createdAt) === 0 ? "Posted today" : `Posted ${daysAgoFunction(job?.createdAt)} days ago`}</p>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`h-8 w-8 ${isSaved 
                        ? 'text-primary-600 hover:text-primary-700 hover:bg-primary-50' 
                        : 'text-gray-400 hover:text-primary-600 hover:bg-primary-50'}`}
                    onClick={handleSaveJob}
                >
                    <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                </Button>
            </div>

            <div className='flex items-start gap-3 mb-4'>
                <Avatar className="h-12 w-12 rounded-md border border-gray-100 shadow-sm">
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                    <AvatarFallback className="rounded-md gradient-bg text-white font-medium">{getCompanyInitials(job?.company?.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='font-bold text-lg text-gray-900'>{job?.title}</h1>
                    <div className="flex items-center text-gray-500 text-sm">
                        <span className="font-medium text-primary-700">{job?.company?.name}</span>
                        <span className="mx-1.5">•</span>
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{job?.location || 'India'}</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <p className='text-sm text-gray-600 line-clamp-2'>{job?.description}</p>
            </div>
            
            <div className='flex flex-wrap items-center gap-2 mb-4'>
                <Badge className={getBadgeColor(job?.jobType)}>
                    {job?.jobType}
                </Badge>
                
                <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                    <Briefcase className="h-3.5 w-3.5 mr-1 text-primary-500" />
                    <span>{job?.position} Position{job?.position > 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded-full">
                    <Banknote className="h-3.5 w-3.5 mr-1 text-success-500" />
                    <span>₹{job?.salary} LPA</span>
                </div>
            </div>

            {/* Contact Number Section */}
            {job?.contactNumber && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">Contact for inquiries</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs border-green-300 text-green-700 hover:bg-green-100"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open(`tel:${job?.contactNumber}`, '_self');
                            }}
                        >
                            <Phone className="h-3 w-3 mr-1" />
                            Call Now
                        </Button>
                    </div>
                    <p className="text-sm text-green-700 mt-1 font-medium">{job?.contactNumber}</p>
                </div>
            )}
            
            <div className='flex items-center gap-3'>
                <Button 
                    onClick={() => navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="text-sm w-full border-gray-200 hover:bg-primary-50 hover:border-primary-300 h-9"
                >
                    View Details
                </Button>
                <Button 
                    className="text-sm w-full gradient-bg hover:bg-primary-700 h-9 flex items-center justify-center gap-1"
                    onClick={() => navigate(`/description/${job?._id}`)}
                >
                    Apply Now <ExternalLink className="h-3.5 w-3.5 ml-1" />
                </Button>
            </div>
        </div>
    )
}

export default Job