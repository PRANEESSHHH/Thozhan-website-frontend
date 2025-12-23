import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '@/utils/axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import useSavedJobs from '@/hooks/useSavedJobs';
import { 
    Briefcase, 
    MapPin, 
    Calendar, 
    DollarSign,
    Clock, 
    User, 
    Building,
    FileText,
    CheckCircle2, 
    ArrowLeft,
    Share2,
    Bookmark,
    Phone,
    Copy,
    Mail,
    MessageCircle,
    ExternalLink
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from './ui/popover';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const { isJobSaved, toggleJobSaved } = useSavedJobs();
    const isInitiallyApplied = singleJob?.applications?.some(application => application.applicant === user?._id) || false;
    const [isApplied, setIsApplied] = useState(isInitiallyApplied);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);

    // Check if positions are available
    const isPositionsAvailable = singleJob?.availablePositions === undefined || singleJob?.availablePositions > 0;
    const canApply = !isApplied && isPositionsAvailable;

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();

    useEffect(() => {
        if (singleJob && user) {
            setIsSaved(isJobSaved(singleJob._id));
        }
    }, [singleJob, user, isJobSaved]);

    // Share functionality
    const getJobUrl = () => {
        return window.location.href;
    };

    const getShareText = () => {
        return `Check out this ${singleJob?.title} position at ${singleJob?.company?.name}! 
        
📍 Location: ${singleJob?.location || 'Remote'}
💰 Salary: ₹${singleJob?.salary} LPA
📝 Job Type: ${singleJob?.jobType}
        
Apply now and advance your career!`;
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(getJobUrl());
            toast.success("Job link copied to clipboard!");
            setIsShareOpen(false);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = getJobUrl();
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            toast.success("Job link copied to clipboard!");
            setIsShareOpen(false);
        }
    };

    const shareToLinkedIn = () => {
        const url = encodeURIComponent(getJobUrl());
        const text = encodeURIComponent(`Check out this ${singleJob?.title} position at ${singleJob?.company?.name}!`);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`, '_blank');
        setIsShareOpen(false);
    };

    const shareToTwitter = () => {
        const url = encodeURIComponent(getJobUrl());
        const text = encodeURIComponent(`🚀 ${singleJob?.title} at ${singleJob?.company?.name} - ${singleJob?.location || 'Remote'} | ₹${singleJob?.salary} LPA`);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=JobOpportunity,Hiring`, '_blank');
        setIsShareOpen(false);
    };

    const shareToFacebook = () => {
        const url = encodeURIComponent(getJobUrl());
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        setIsShareOpen(false);
    };

    const shareToWhatsApp = () => {
        const text = encodeURIComponent(`${getShareText()}\n\n${getJobUrl()}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
        setIsShareOpen(false);
    };

    const shareViaEmail = () => {
        const subject = encodeURIComponent(`Job Opportunity: ${singleJob?.title} at ${singleJob?.company?.name}`);
        const body = encodeURIComponent(`${getShareText()}\n\nView and apply here: ${getJobUrl()}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_self');
        setIsShareOpen(false);
    };

    // Handle save job
    const handleSaveJob = () => {
        if (!user) {
            toast.error("Please login to save jobs");
            return;
        }
        toggleJobSaved(singleJob?._id);
        setIsSaved(!isSaved);
        toast.success(isSaved ? "Job removed from saved jobs" : "Job saved to your collection");
    };

    const applyJobHandler = async () => {
        try {
            const res = await axiosInstance.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {});
            
            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = { ...singleJob, applications: [...singleJob.applications, { applicant: user?._id }] };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
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
                return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'Part-Time':
                return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
            case 'Contract':
                return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
            case 'Temporary':
                return 'bg-green-100 text-green-700 hover:bg-green-100';
            default:
                return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            setIsLoading(true);
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`);
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load job details");
            } finally {
                setIsLoading(false);
            }
        }
        fetchSingleJob(); 
    }, [jobId, dispatch, user?._id]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="mb-6">
                        <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800">
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            <span>Back to Jobs</span>
                        </Link>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header section */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex gap-4">
                                    <Avatar className="h-16 w-16 rounded-md border border-gray-200">
                                        <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                                        <AvatarFallback className="rounded-md bg-blue-100 text-blue-700 text-lg">
                                            {getCompanyInitials(singleJob?.company?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{singleJob?.title}</h1>
                                        <div className="flex items-center text-gray-600 mt-1">
                                            <Building className="h-4 w-4 mr-1" />
                                            <span className="font-medium">{singleJob?.company?.name}</span>
                                            <span className="mx-2">•</span>
                                            <MapPin className="h-4 w-4 mr-1" />
                                            <span>{singleJob?.location || 'Remote'}</span>
                                        </div>
                                        
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            <Badge className={getBadgeColor(singleJob?.jobType)}>
                                                {singleJob?.jobType}
                                            </Badge>
                                            <Badge variant="outline" className="text-gray-700 bg-gray-50">
                                                <DollarSign className="h-3 w-3 mr-1" /> {singleJob?.salary} LPA
                                            </Badge>
                                            <Badge variant="outline" className="text-gray-700 bg-gray-50">
                                                <Clock className="h-3 w-3 mr-1" /> {singleJob?.experience}+ yrs
                                            </Badge>
                                            <Badge variant="outline" className="text-gray-700 bg-gray-50">
                                                <User className="h-3 w-3 mr-1" /> {singleJob?.applications?.length || 0} applicants
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleSaveJob}
                                        variant="outline"
                                        className={`h-10 gap-1 ${isSaved 
                                            ? 'text-blue-600 border-blue-300 hover:bg-blue-50' 
                                            : 'border-gray-300'}`}
                                    >
                                        <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                                        {isSaved ? "Saved" : "Save Job"}
                                    </Button>
                                    
                                    <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="h-10 gap-1 border-gray-300">
                                                <Share2 className="h-4 w-4" />
                                                Share
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-64 p-0" align="end">
                                            <div className="p-3">
                                                <h4 className="font-medium text-sm text-gray-900 mb-3">Share this job</h4>
                                                <div className="space-y-1">
                                                    <button 
                                                        onClick={copyToClipboard}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                        Copy Link
                                                    </button>
                                                    
                                                    <div className="border-t my-2"></div>
                                                    
                                                    <button 
                                                        onClick={shareToLinkedIn}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <ExternalLink className="h-4 w-4 text-blue-600" />
                                                        Share on LinkedIn
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={shareToTwitter}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <ExternalLink className="h-4 w-4 text-blue-400" />
                                                        Share on Twitter
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={shareToFacebook}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <ExternalLink className="h-4 w-4 text-blue-700" />
                                                        Share on Facebook
                                                    </button>
                                                    
                                                    <div className="border-t my-2"></div>
                                                    
                                                    <button 
                                                        onClick={shareToWhatsApp}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <MessageCircle className="h-4 w-4 text-green-600" />
                                                        Share via WhatsApp
                                                    </button>
                                                    
                                                    <button 
                                                        onClick={shareViaEmail}
                                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                                    >
                                                        <Mail className="h-4 w-4 text-gray-600" />
                                                        Share via Email
                                                    </button>
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    
                                    <Button
                                        onClick={canApply ? applyJobHandler : null}
                                        disabled={!canApply}
                                        className={`h-10 px-6 ${
                                            isApplied 
                                                ? 'bg-green-600 hover:bg-green-700 gap-1 cursor-not-allowed' 
                                                : !isPositionsAvailable
                                                ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                    >
                                        {isApplied ? (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-1" /> Applied
                                            </>
                                        ) : !isPositionsAvailable ? (
                                            'No Positions Available'
                                        ) : (
                                            'Apply Now'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Job details section */}
                        <div className="p-6">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                                    Job Description
                                </h2>
                                <p className="text-gray-700 whitespace-pre-line">{singleJob?.description}</p>
                            </div>
                            
                            <div className="mt-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                                            <Briefcase className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Job Title</h3>
                                            <p className="text-gray-900">{singleJob?.title}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                                            <MapPin className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Location</h3>
                                            <p className="text-gray-900">{singleJob?.location || 'Remote'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Experience Required</h3>
                                            <p className="text-gray-900">{singleJob?.experience} years</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                                            <DollarSign className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Salary</h3>
                                            <p className="text-gray-900">₹{singleJob?.salary} LPA</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                                            <User className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Positions Available</h3>
                                            <div className="flex items-center gap-2">
                                                <p className="text-gray-900">
                                                    {singleJob?.availablePositions !== undefined 
                                                        ? `${singleJob.availablePositions} of ${singleJob.position}` 
                                                        : singleJob?.position
                                                    } {singleJob?.position > 1 ? 'positions' : 'position'}
                                                </p>
                                                {singleJob?.availablePositions !== undefined && singleJob.availablePositions === 0 && (
                                                    <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                                                        No positions left
                                                    </Badge>
                                                )}
                                                {singleJob?.availablePositions !== undefined && singleJob.availablePositions > 0 && (
                                                    <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                                                        {singleJob.availablePositions} available
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start">
                                        <div className="p-2 rounded-full bg-blue-50 mr-3">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Posted Date</h3>
                                            <p className="text-gray-900">{formatDate(singleJob?.createdAt)}</p>
                                        </div>
                                    </div>

                                    {/* Contact Number */}
                                    {singleJob?.contactNumber && (
                                        <div className="flex items-start">
                                            <div className="p-2 rounded-full bg-green-50 mr-3">
                                                <Phone className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-gray-900 font-medium">{singleJob?.contactNumber}</p>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs border-green-300 text-green-700 hover:bg-green-50"
                                                        onClick={() => window.open(`tel:${singleJob?.contactNumber}`, '_self')}
                                                    >
                                                        Call Now
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Click to call and inquire about this job</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center sm:justify-start">
                                <Button
                                    onClick={canApply ? applyJobHandler : null}
                                    disabled={!canApply}
                                    className={`px-8 ${
                                        isApplied 
                                            ? 'bg-green-600 hover:bg-green-700 gap-1 cursor-not-allowed' 
                                            : !isPositionsAvailable
                                            ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {isApplied ? (
                                        <>
                                            <CheckCircle2 className="h-4 w-4 mr-1" /> Already Applied
                                        </>
                                    ) : !isPositionsAvailable ? (
                                        'No Positions Available'
                                    ) : (
                                        'Apply for this job'
                                    )}
                                </Button>
                                
                                <Button
                                    variant="outline"
                                    className={`border-gray-300 gap-2 ${isSaved ? 'text-blue-600' : ''}`}
                                    onClick={handleSaveJob}
                                >
                                    <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                                    {isSaved ? 'Saved' : 'Save for later'}
                                </Button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Similar jobs section - optional, can be added in future */}
                </div>
            </main>
            
            <Footer />
        </div>
    )
}

export default JobDescription