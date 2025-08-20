import React, { useState, useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { useSelector, useDispatch } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Briefcase, Loader2, MapPin, IndianRupee, Users, Clock, Building } from 'lucide-react'
import { resetLoading } from '@/redux/authSlice'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const PostJob = () => {
    // Ensure companies are loaded
    useGetAllCompanies();
    
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "Full-Time",
        experience: "Entry Level",
        position: 1,
        contactNumber: "",
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { companies } = useSelector(store => store.company);

    useEffect(() => {
        dispatch(resetLoading());
    }, [dispatch]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (field, value) => {
        if (field === 'company') {
            // Value is now company._id directly
            setInput({ ...input, companyId: value });
        } else {
            setInput({ ...input, [field]: value });
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validation - check ALL required fields that backend expects
        if (!input.title || !input.description || !input.salary || !input.location || !input.contactNumber || !input.companyId) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            
            // Ensure requirements is not empty (backend splits by comma)
            let requirementsText = input.requirements.trim();
            if (!requirementsText) {
                requirementsText = "No specific requirements";
            }
            
            // Prepare data for backend - EXACT field names the backend expects
            const jobData = {
                title: input.title.trim(),
                description: input.description.trim(),
                requirements: requirementsText,
                salary: parseInt(input.salary),
                location: input.location.trim(),
                jobType: input.jobType,
                experience: input.experience, // Send as text, not number - backend expects text
                position: parseInt(input.position),
                contactNumber: input.contactNumber.trim(),
                companyId: input.companyId
            };
            
            // Debug: log each field to see what we're sending
            console.log('=== JOB DATA BEING SENT ===');
            console.log('title:', jobData.title);
            console.log('description:', jobData.description);
            console.log('requirements:', jobData.requirements);
            console.log('salary:', jobData.salary);
            console.log('location:', jobData.location);
            console.log('jobType:', jobData.jobType);
            console.log('experience:', jobData.experience);
            console.log('position:', jobData.position);
            console.log('contactNumber:', jobData.contactNumber);
            console.log('companyId:', jobData.companyId);
            console.log('=== END DEBUG ===');
            
            const res = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials:true
            });
            
            if (res.data.success) {
                toast.success("Job posted successfully!");
                navigate("/admin/dashboard");
            }
        } catch (error) {
            console.error('Job posting error:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || "Failed to post job";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    if (companies.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className='max-w-2xl mx-auto px-4 py-8'>
                    <Card className="text-center">
                        <CardHeader>
                            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <CardTitle className="text-xl">No Company Found</CardTitle>
                            <CardDescription>
                                You need to register a company before posting jobs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                onClick={() => navigate("/admin/companies/create")}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Building className="h-4 w-4 mr-2" />
                                Register Your Company
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='max-w-3xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className="mb-8">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate("/admin/dashboard")}
                        className="mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
                    <p className="text-gray-600">Fill out the form below to post a job opening</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Briefcase className="h-5 w-5" />
                            Job Details
                        </CardTitle>
                        <CardDescription>
                            Provide basic information about the job position
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submitHandler} className="space-y-6">
                            {/* Job Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-medium">
                                    Job Title *
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Construction Worker, Electrician, Plumber"
                                    className="w-full"
                                    required
                                />
                                <p className="text-xs text-gray-500">What is the job position called?</p>
                            </div>

                            {/* Company Selection */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Select Company *
                                </Label>
                                <Select onValueChange={(value) => selectChangeHandler('company', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choose which company this job is for" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company, index) => (
                                                <SelectItem 
                                                    key={`company-${company._id || index}-${company.name}`} 
                                                    value={company._id}
                                                >
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">Which company is hiring for this position?</p>
                            </div>

                            {/* Job Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">
                                    Job Description *
                                </Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={input.description}
                                    onChange={changeEventHandler}
                                    placeholder="Describe what the worker will do on a daily basis..."
                                    className="w-full min-h-[100px]"
                                    required
                                />
                                <p className="text-xs text-gray-500">What will the person do in this job?</p>
                            </div>

                            {/* Requirements */}
                            <div className="space-y-2">
                                <Label htmlFor="requirements" className="text-sm font-medium">
                                    Skills & Requirements
                                </Label>
                                <Textarea
                                    id="requirements"
                                    name="requirements"
                                    value={input.requirements}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. Valid driver's license, 2 years experience, safety certification"
                                    className="w-full min-h-[80px]"
                                />
                                <p className="text-xs text-gray-500">What skills or qualifications are needed? (separate with commas)</p>
                            </div>

                            {/* Location and Salary Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1">
                                        <MapPin className="h-3 w-3" />
                                        Work Location *
                                    </Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        name="location"
                                        value={input.location}
                                        onChange={changeEventHandler}
                                        placeholder="e.g. Mumbai, Delhi, Remote"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">Where will they work?</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="salary" className="text-sm font-medium flex items-center gap-1">
                                        <IndianRupee className="h-3 w-3" />
                                        Salary (Per Month) *
                                    </Label>
                                    <Input
                                        id="salary"
                                        type="number"
                                        name="salary"
                                        value={input.salary}
                                        onChange={changeEventHandler}
                                        placeholder="e.g. 25000"
                                        required
                                    />
                                    <p className="text-xs text-gray-500">Monthly salary in rupees</p>
                                </div>
                            </div>

                            {/* Contact Number */}
                            <div className="space-y-2">
                                <Label htmlFor="contactNumber" className="text-sm font-medium flex items-center gap-1">
                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Contact Number *
                                </Label>
                                <Input
                                    id="contactNumber"
                                    type="tel"
                                    name="contactNumber"
                                    value={input.contactNumber}
                                    onChange={changeEventHandler}
                                    placeholder="e.g. +91 9876543210"
                                    required
                                />
                                <p className="text-xs text-gray-500">Phone number for workers to contact about this job</p>
                            </div>

                            {/* Job Type and Experience Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        Job Type
                                    </Label>
                                    <Select value={input.jobType} onValueChange={(value) => selectChangeHandler('jobType', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Full-Time">Full-Time (8 hours/day)</SelectItem>
                                            <SelectItem value="Part-Time">Part-Time (4-6 hours/day)</SelectItem>
                                            <SelectItem value="Contract">Contract (Project basis)</SelectItem>
                                            <SelectItem value="Temporary">Temporary (Short term)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">How many hours per day?</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">
                                        Experience Required
                                    </Label>
                                    <Select value={input.experience} onValueChange={(value) => selectChangeHandler('experience', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Entry Level">Entry Level (No experience needed)</SelectItem>
                                            <SelectItem value="1-2 years">1-2 years experience</SelectItem>
                                            <SelectItem value="3-5 years">3-5 years experience</SelectItem>
                                            <SelectItem value="5+ years">5+ years experience</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-xs text-gray-500">How much experience is required?</p>
                                </div>
                            </div>

                            {/* Number of Positions */}
                            <div className="space-y-2">
                                <Label htmlFor="position" className="text-sm font-medium flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    Number of Openings
                                </Label>
                                <Input
                                    id="position"
                                    type="number"
                                    name="position"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    min="1"
                                    className="w-32"
                                />
                                <p className="text-xs text-gray-500">How many people are you hiring?</p>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                {loading ? (
                                    <Button disabled className="w-full">
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Posting Job...
                                    </Button>
                                ) : (
                                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                                        <Briefcase className="h-4 w-4 mr-2" />
                                        Post This Job
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default PostJob