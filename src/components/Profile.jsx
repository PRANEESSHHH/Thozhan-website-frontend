import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { 
    Contact, 
    Mail, 
    Pen, 
    FileText, 
    Bookmark,
    CalendarDays,
    MapPin,
    GraduationCap,
    UserCircle,
    Building,
    Briefcase,
    Loader2,
    Save,
    X,
    Building2,
    Users,
    BarChart3,
    PlusCircle,
    TrendingUp,
    Eye,
    Edit
} from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import AppliedJobTable from './AppliedJobTable'
import { useSelector, useDispatch } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import useSavedJobs from '@/hooks/useSavedJobs'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Footer from './shared/Footer'
import { Separator } from './ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/card"
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    const { user } = useSelector(store => store.auth);
    const { companies } = useSelector(store => store.company);
    const { allAdminJobs } = useSelector(store => store.job);
    const { allJobs, allAppliedJobs } = useSelector(store => store.job);
    
    // Conditionally call hooks based on user role
    if (user?.role === 'worker') {
        useGetAppliedJobs();
    } else if (user?.role === 'employer') {
        useGetAllCompanies();
        useGetAllAdminJobs();
    }
    
    const { savedJobs } = useSavedJobs();
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("profile");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch();
    
    // Form state
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        phoneNumber: '',
        bio: '',
        location: '',
        experience: '',
        skills: [],
        skillInput: '',
        file: null
    });
    
    // Initialize form data when user data is available
    useEffect(() => {
        if (user) {
            setFormData({
                fullname: user.fullname || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                bio: user.profile?.bio || '',
                location: user.profile?.location || '',
                experience: user.profile?.experience || '',
                skills: user.profile?.skills || [],
                skillInput: '',
                file: null
            });
        }
    }, [user]);
    
    // Get saved jobs data from all jobs (for workers)
    const savedJobsData = user?.role === 'worker' ? allJobs.filter(job => savedJobs.includes(job._id)) : [];
    
    // Employer statistics
    const employerStats = user?.role === 'employer' ? {
        totalCompanies: companies?.length || 0,
        totalJobs: allAdminJobs?.length || 0,
        totalApplications: allAdminJobs?.reduce((total, job) => total + (job.applications?.length || 0), 0) || 0,
        recentJobs: allAdminJobs?.filter(job => {
            const jobDate = new Date(job.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return jobDate >= weekAgo;
        }).length || 0
    } : null;
    
    // Handle query params
    useEffect(() => {
        const settings = searchParams.get('settings');
        if (settings === 'true') {
            setEditing(true);
        }
        
        // Check if there's a hash in the URL, like #applications
        if (window.location.hash === '#applications') {
            setActiveTab('applications');
        }
    }, [searchParams]);

    const getInitials = (name) => {
        if (!name) return "U";
        const words = name.split(" ");
        if (words.length === 1) return name.slice(0, 1).toUpperCase();
        return (words[0][0] + words[1][0]).toUpperCase();
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error("File size should be less than 10MB");
                return;
            }
            setFormData(prev => ({
                ...prev,
                file
            }));
        }
    };
    
    const handleSkillInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            skillInput: e.target.value
        }));
    };
    
    const addSkill = () => {
        if (formData.skillInput.trim() && !formData.skills.includes(formData.skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, prev.skillInput.trim()],
                skillInput: ''
            }));
        }
    };
    
    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };
    
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && formData.skillInput.trim()) {
            e.preventDefault();
            addSkill();
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.fullname || !formData.email) {
            toast.error("Name and email are required");
            return;
        }
        
        const form = new FormData();
        form.append('fullname', formData.fullname);
        form.append('email', formData.email);
        form.append('phoneNumber', formData.phoneNumber);
        form.append('bio', formData.bio);
        form.append('location', formData.location);
        form.append('experience', formData.experience);
        form.append('skills', formData.skills.join(','));
        
        if (formData.file) {
            form.append('file', formData.file);
        }
        
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials:true
            });
            
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setEditing(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const getDaysAgo = (dateString) => {
        const createdAt = new Date(dateString);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        const daysAgo = Math.floor(timeDifference/(1000*24*60*60));
        
        if (daysAgo === 0) return "Today";
        if (daysAgo === 1) return "1 day ago";
        if (daysAgo < 7) return `${daysAgo} days ago`;
        if (daysAgo < 30) return `${Math.floor(daysAgo / 7)} week${Math.floor(daysAgo / 7) > 1 ? 's' : ''} ago`;
        return `${Math.floor(daysAgo / 30)} month${Math.floor(daysAgo / 30) > 1 ? 's' : ''} ago`;
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 relative">
                        <div className="bg-gradient-to-r from-primary-600 to-primary-500 h-32 relative rounded-t-lg">
                            {!editing && (
                            <Button 
                                    onClick={() => setEditing(true)} 
                                variant="outline" 
                                size="sm" 
                                className="absolute right-4 top-4 bg-white hover:bg-gray-100"
                            >
                                <Pen className="h-4 w-4 mr-1" /> Edit Profile
                            </Button>
                            )}
                        </div>
                        
                        <div className="px-6 pb-6 pt-4 flex flex-col md:flex-row gap-6 relative">
                            <div className="flex flex-col items-center md:items-start -mt-20 md:mr-8 min-w-0 flex-shrink-0 relative z-10">
                                <Avatar className="h-28 w-28 border-4 border-white shadow-lg bg-white">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                    <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">
                                        {getInitials(user?.fullname)}
                                    </AvatarFallback>
                                </Avatar>
                                <h1 className="font-bold text-xl mt-3 truncate max-w-[200px]">{user?.fullname}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="bg-primary-100 text-primary-700">
                                        {user?.role === 'worker' ? 'Job Seeker' : 'Employer'}
                                    </Badge>
                                </div>
                                <p className="text-gray-600 text-sm text-center md:text-left mt-1 break-words max-w-[280px] leading-relaxed overflow-hidden" 
                                   style={{
                                       display: '-webkit-box',
                                       WebkitLineClamp: 3,
                                       WebkitBoxOrient: 'vertical'
                                   }}>
                                    {user?.profile?.bio || "No bio added yet"}
                                </p>
                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                    <CalendarDays className="h-4 w-4 mr-1" />
                                    <span>Joined {new Date(user?.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            
                            <div className="flex-grow mt-8 md:mt-0 min-w-0">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2 min-w-0">
                                        <div className="p-2 rounded-full bg-primary-50 flex-shrink-0">
                                            <Mail className="h-4 w-4 text-primary-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="text-sm text-gray-700 break-all">{user?.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 min-w-0">
                                        <div className="p-2 rounded-full bg-primary-50 flex-shrink-0">
                                            <Contact className="h-4 w-4 text-primary-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500">Phone</p>
                                            <p className="text-sm text-gray-700 break-all">{user?.phoneNumber || "Not provided"}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 min-w-0">
                                        <div className="p-2 rounded-full bg-primary-50 flex-shrink-0">
                                            <MapPin className="h-4 w-4 text-primary-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500">Location</p>
                                            <p className="text-sm text-gray-700 break-words">{user?.profile?.location || "Not provided"}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-2 min-w-0">
                                        <div className="p-2 rounded-full bg-primary-50 flex-shrink-0">
                                            {user?.role === 'employer' ? (
                                                <Building2 className="h-4 w-4 text-primary-600" />
                                            ) : (
                                                <Briefcase className="h-4 w-4 text-primary-600" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-gray-500">
                                                {user?.role === 'employer' ? 'Industry' : 'Experience'}
                                            </p>
                                            <p className="text-sm text-gray-700 break-words">{user?.profile?.experience || "Not provided"}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {user?.role === 'worker' && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {user?.profile?.skills && user.profile.skills.length > 0 ? (
                                                user.profile.skills.map((skill, index) => (
                                                    <Badge key={index} variant="secondary" className="bg-primary-50 text-primary-600 hover:bg-primary-100">
                                                        {skill}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-500">No skills added yet</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {user?.role === 'employer' && employerStats && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Overview</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            <div className="bg-primary-50 p-3 rounded-lg text-center">
                                                <Building2 className="h-5 w-5 text-primary-600 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-primary-700">{employerStats.totalCompanies}</p>
                                                <p className="text-xs text-gray-600">Companies</p>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded-lg text-center">
                                                <Briefcase className="h-5 w-5 text-green-600 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-green-700">{employerStats.totalJobs}</p>
                                                <p className="text-xs text-gray-600">Jobs Posted</p>
                                            </div>
                                            <div className="bg-blue-50 p-3 rounded-lg text-center">
                                                <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-blue-700">{employerStats.totalApplications}</p>
                                                <p className="text-xs text-gray-600">Applications</p>
                                            </div>
                                            <div className="bg-orange-50 p-3 rounded-lg text-center">
                                                <TrendingUp className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                                                <p className="text-lg font-bold text-orange-700">{employerStats.recentJobs}</p>
                                                <p className="text-xs text-gray-600">This Week</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Content Tabs */}
                    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className={`grid w-full ${user?.role === 'employer' ? 'grid-cols-3' : 'grid-cols-3'} mb-6`}>
                            <TabsTrigger value="profile" className="flex items-center gap-1">
                                <UserCircle className="h-4 w-4" /> Profile
                            </TabsTrigger>
                            {user?.role === 'worker' ? (
                                <>
                                    <TabsTrigger value="applications" className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" /> Applications
                                    </TabsTrigger>
                                    <TabsTrigger value="saved" className="flex items-center gap-1">
                                        <Bookmark className="h-4 w-4" /> Saved Jobs
                                    </TabsTrigger>
                                </>
                            ) : (
                                <>
                                    <TabsTrigger value="jobs" className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" /> My Jobs
                                    </TabsTrigger>
                                    <TabsTrigger value="analytics" className="flex items-center gap-1">
                                        <BarChart3 className="h-4 w-4" /> Analytics
                                    </TabsTrigger>
                                </>
                            )}
                        </TabsList>
                        
                        <TabsContent value="profile" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>About {user?.role === 'employer' ? 'Company' : 'Me'}</CardTitle>
                                    <CardDescription>
                                        {user?.role === 'employer' 
                                            ? 'Your company information and business details' 
                                            : 'Your professional information and resume'
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="overflow-hidden">
                                    {editing ? (
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fullname">
                                                    {user?.role === 'employer' ? 'Company Name' : 'Full Name'}
                                                </Label>
                                                <Input 
                                                    id="fullname" 
                                                    name="fullname" 
                                                    value={formData.fullname} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input 
                                                    id="email" 
                                                    name="email" 
                                                    type="email" 
                                                    value={formData.email} 
                                                    onChange={handleChange} 
                                                    required 
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                                <Input 
                                                    id="phoneNumber" 
                                                    name="phoneNumber" 
                                                    value={formData.phoneNumber} 
                                                    onChange={handleChange} 
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="bio">
                                                    {user?.role === 'employer' ? 'Company Description' : 'Bio'}
                                                </Label>
                                                <Textarea 
                                                    id="bio" 
                                                    name="bio" 
                                                    value={formData.bio} 
                                                    onChange={handleChange} 
                                                    placeholder={user?.role === 'employer' 
                                                        ? "Tell us about your company and what you do" 
                                                        : "Tell us about yourself"
                                                    }
                                                    className="min-h-[120px] max-h-[300px] resize-y leading-relaxed"
                                                    rows={5}
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input 
                                                    id="location" 
                                                    name="location" 
                                                    value={formData.location} 
                                                    onChange={handleChange} 
                                                    placeholder="e.g. New York, NY"
                                                />
                                            </div>
                                            
                                            <div className="space-y-2">
                                                <Label htmlFor="experience">
                                                    {user?.role === 'employer' ? 'Industry/Business Type' : 'Experience'}
                                                </Label>
                                                <Input 
                                                    id="experience" 
                                                    name="experience" 
                                                    value={formData.experience} 
                                                    onChange={handleChange} 
                                                    placeholder={user?.role === 'employer' 
                                                        ? "e.g. Construction, Manufacturing, Transportation" 
                                                        : "e.g. 5 years in construction"
                                                    }
                                                />
                                            </div>
                                            
                                            {user?.role === 'worker' && (
                                                <div className="space-y-2">
                                                    <Label>Skills</Label>
                                                    <div className="flex flex-wrap gap-2 mb-2">
                                                        {formData.skills.map((skill, index) => (
                                                            <Badge 
                                                                key={index} 
                                                                variant="secondary" 
                                                                className="bg-primary-50 text-primary-600 hover:bg-primary-100"
                                                            >
                                                                {skill}
                                                                <X 
                                                                    className="h-3 w-3 ml-1 cursor-pointer hover:text-red-500" 
                                                                    onClick={() => removeSkill(skill)}
                                                                />
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Input 
                                                            value={formData.skillInput}
                                                            onChange={handleSkillInputChange}
                                                            onKeyPress={handleKeyPress}
                                                            placeholder="Add a skill and press Enter"
                                                        />
                                                        <Button 
                                                            type="button" 
                                                            onClick={addSkill}
                                                            className="px-3"
                                                        >
                                                            Add
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {user?.role === 'worker' && (
                                                <div className="space-y-2">
                                                    <Label htmlFor="resume">Resume</Label>
                                                    <Input 
                                                        id="resume" 
                                                        name="resume" 
                                                        type="file" 
                                                        accept=".pdf,.doc,.docx"
                                                        onChange={handleFileChange}
                                                        className="cursor-pointer"
                                                    />
                                                    {user?.profile?.resume && (
                                                        <p className="text-sm text-gray-500">
                                                            Current: {user.profile.resumeOriginalName || "Resume.pdf"}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-gray-500">
                                                        Upload PDF or Word document (max 10MB)
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div className="flex gap-2 justify-end">
                                                <Button 
                                                    type="button" 
                                                    variant="outline" 
                                                    onClick={() => setEditing(false)}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button 
                                                    type="submit" 
                                                    disabled={loading}
                                                    className="bg-primary-600 hover:bg-primary-700"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    ) : (
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">
                                                {user?.role === 'employer' ? 'Company Description' : 'Bio'}
                                            </Label>
                                            <div className="p-4 bg-gray-50 rounded-lg border min-h-[60px] max-h-[200px] overflow-y-auto">
                                                <p className="text-gray-700 break-words whitespace-pre-wrap leading-relaxed text-sm">
                                                    {user?.profile?.bio || "No description added yet"}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <Separator />
                                        
                                        {user?.role === 'worker' && (
                                            <div>
                                                <Label className="text-sm font-medium">Resume</Label>
                                                <div className="mt-2">
                                                    {user?.profile?.resume ? (
                                                        <a 
                                                            target="_blank" 
                                                            href={user.profile.resume} 
                                                            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-800"
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            {user.profile.resumeOriginalName || "View Resume"}
                                                        </a>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm">No resume uploaded</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    )}
                                </CardContent>
                                {!editing && (
                                <CardFooter>
                                        <Button variant="outline" onClick={() => setEditing(true)}>
                                        <Pen className="h-4 w-4 mr-2" /> Update Profile
                                    </Button>
                                </CardFooter>
                                )}
                            </Card>
                        </TabsContent>
                        
                        {/* Worker-specific tabs */}
                        {user?.role === 'worker' && (
                            <>
                                <TabsContent value="applications" className="space-y-6">
                                    <div>
                                        <h2 className='text-xl font-semibold mb-4'>Job Applications</h2>
                                        {allAppliedJobs.length > 0 ? (
                                            <AppliedJobTable />
                                        ) : (
                                            <Card className="border border-gray-200 p-8 text-center">
                                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <FileText className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium mb-2">No applications yet</h3>
                                                <p className="text-gray-600 mb-6">You haven't applied to any jobs yet</p>
                                                <Button onClick={() => navigate('/jobs')} className="bg-primary-600 hover:bg-primary-700">
                                                    Browse Jobs
                                                </Button>
                                            </Card>
                                        )}
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="saved" className="space-y-6">
                                    <div>
                                        <h2 className='text-xl font-semibold mb-4'>Saved Jobs</h2>
                                        {savedJobsData.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {savedJobsData.map(job => (
                                                    <Card key={job._id} className="border border-gray-200 hover:border-primary-200 transition-all">
                                                        <CardHeader className="p-4">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-start gap-3">
                                                                    <Avatar className="h-10 w-10 rounded-md border border-gray-200">
                                                                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                                                        <AvatarFallback className="rounded-md bg-primary-100 text-primary-700 text-sm">
                                                                            {job?.company?.name?.substring(0, 2).toUpperCase() || "CO"}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <CardTitle className="text-base">{job.title}</CardTitle>
                                                                        <CardDescription className="flex items-center text-xs mt-1">
                                                                            <Building className="h-3 w-3 mr-1" />
                                                                            {job.company?.name}
                                                                            <span className="mx-1">•</span>
                                                                            <MapPin className="h-3 w-3 mr-1" />
                                                                            {job.location || "Remote"}
                                                                        </CardDescription>
                                                                    </div>
                                                                </div>
                                                                <Badge variant="outline" className="text-xs bg-primary-50 text-primary-600 border-primary-200">
                                                                    {job.jobType}
                                                                </Badge>
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent className="p-4 pt-0">
                                                            <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                                                        </CardContent>
                                                        <CardFooter className="p-4 pt-0 flex justify-between">
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium text-gray-700">₹{job.salary} LPA</span>
                                                            </div>
                                                            <Button 
                                                                variant="default" 
                                                                size="sm" 
                                                                className="bg-primary-600 hover:bg-primary-700"
                                                                onClick={() => navigate(`/description/${job._id}`)}
                                                            >
                                                                View Details
                                                            </Button>
                                                        </CardFooter>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <Card className="border border-gray-200 p-8 text-center">
                                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                    <Bookmark className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-medium mb-2">No saved jobs</h3>
                                                <p className="text-gray-600 mb-6">You haven't saved any jobs yet</p>
                                                <Button onClick={() => navigate('/jobs')} className="bg-primary-600 hover:bg-primary-700">
                                                    Browse Jobs
                                                </Button>
                                            </Card>
                                        )}
                                    </div>
                                </TabsContent>
                            </>
                        )}
                        
                        {/* Employer-specific tabs */}
                        {user?.role === 'employer' && (
                            <>
                                <TabsContent value="jobs" className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h2 className='text-xl font-semibold'>My Job Posts</h2>
                                        <Button 
                                            onClick={() => navigate('/admin/jobs/create')}
                                            className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2"
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            Post New Job
                                        </Button>
                                    </div>
                                    
                                    {allAdminJobs && allAdminJobs.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {allAdminJobs.map(job => (
                                                <Card key={job._id} className="border border-gray-200 hover:border-primary-200 transition-all">
                                                    <CardHeader className="p-4">
                                                        <div className="flex justify-between items-start">
                                                            <div className="flex items-start gap-3">
                                                                <Avatar className="h-10 w-10 rounded-md border border-gray-200">
                                                                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                                                    <AvatarFallback className="rounded-md bg-primary-100 text-primary-700 text-sm">
                                                                        {job?.company?.name?.substring(0, 2).toUpperCase() || "CO"}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <CardTitle className="text-base">{job.title}</CardTitle>
                                                                    <CardDescription className="flex items-center text-xs mt-1">
                                                                        <Building className="h-3 w-3 mr-1" />
                                                                        {job.company?.name}
                                                                        <span className="mx-1">•</span>
                                                                        <MapPin className="h-3 w-3 mr-1" />
                                                                        {job.location || "Remote"}
                                                                    </CardDescription>
                                                                </div>
                                                            </div>
                                                            <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                                                                {job.applications?.length || 0} applicants
                                                            </Badge>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-4 pt-0">
                                                        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                                                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                                            <span>Posted {getDaysAgo(job.createdAt)}</span>
                                                            <span>₹{job.salary} LPA</span>
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="p-4 pt-0 flex justify-between gap-2">
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm" 
                                                            className="flex-1"
                                                            onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                        >
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View Applicants
                                                        </Button>
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            onClick={() => navigate(`/description/${job._id}`)}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <Card className="border border-gray-200 p-8 text-center">
                                            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <Briefcase className="h-8 w-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
                                            <p className="text-gray-600 mb-6">Start hiring by posting your first job</p>
                                            <Button 
                                                onClick={() => navigate('/admin/jobs/create')} 
                                                className="bg-primary-600 hover:bg-primary-700"
                                            >
                                                <PlusCircle className="h-4 w-4 mr-2" />
                                                Post Your First Job
                                            </Button>
                                        </Card>
                                    )}
                                </TabsContent>
                                
                                <TabsContent value="analytics" className="space-y-6">
                                    <div>
                                        <h2 className='text-xl font-semibold mb-4'>Analytics Overview</h2>
                                        
                                        {employerStats && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                                <Card className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Total Companies</p>
                                                            <p className="text-2xl font-bold text-primary-600">{employerStats.totalCompanies}</p>
                                                        </div>
                                                        <Building2 className="h-8 w-8 text-primary-600" />
                                                    </div>
                                                </Card>
                                                
                                                <Card className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Active Jobs</p>
                                                            <p className="text-2xl font-bold text-green-600">{employerStats.totalJobs}</p>
                                                        </div>
                                                        <Briefcase className="h-8 w-8 text-green-600" />
                                                    </div>
                                                </Card>
                                                
                                                <Card className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Total Applications</p>
                                                            <p className="text-2xl font-bold text-blue-600">{employerStats.totalApplications}</p>
                                                        </div>
                                                        <Users className="h-8 w-8 text-blue-600" />
                                                    </div>
                                                </Card>
                                                
                                                <Card className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-sm text-gray-600">This Week</p>
                                                            <p className="text-2xl font-bold text-orange-600">{employerStats.recentJobs}</p>
                                                        </div>
                                                        <TrendingUp className="h-8 w-8 text-orange-600" />
                                                    </div>
                                                </Card>
                                            </div>
                                        )}
                                        
                                        <Card className="p-6">
                                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                                            {allAdminJobs && allAdminJobs.length > 0 ? (
                                                <div className="space-y-3">
                                                    {allAdminJobs.slice(0, 5).map(job => (
                                                        <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-primary-100 rounded-full">
                                                                    <Briefcase className="h-4 w-4 text-primary-600" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-sm">{job.title}</p>
                                                                    <p className="text-xs text-gray-600">
                                                                        {job.applications?.length || 0} applications • Posted {getDaysAgo(job.createdAt)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-center py-8">No recent activity</p>
                                            )}
                                        </Card>
                                    </div>
                                </TabsContent>
                            </>
                        )}
                    </Tabs>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}

export default Profile