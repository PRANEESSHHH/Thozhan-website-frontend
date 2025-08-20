import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { 
    Building2, 
    MapPin, 
    Calendar, 
    Clock, 
    CheckCircle, 
    XCircle, 
    HourglassIcon,
    ExternalLink,
    Eye,
    Briefcase,
    Users,
    Search,
    Filter,
    Phone
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Input } from './ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'accepted':
            return <CheckCircle className="w-5 h-5 text-green-600" />;
        case 'rejected':
            return <XCircle className="w-5 h-5 text-red-600" />;
        case 'waitlist':
            return <HourglassIcon className="w-5 h-5 text-yellow-600" />;
        case 'pending':
        default:
            return <Clock className="w-5 h-5 text-blue-600" />;
    }
};

const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
        case 'accepted':
            return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
        case 'rejected':
            return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
        case 'waitlist':
            return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Waitlist</Badge>;
        case 'pending':
        default:
            return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Pending</Badge>;
    }
};

const MyApplications = () => {
    const { allAppliedJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    
    // Call the hook to fetch applied jobs
    useGetAppliedJobs();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [filteredApplications, setFilteredApplications] = useState([]);
    
    // Statistics
    const stats = {
        total: allAppliedJobs?.length || 0,
        pending: allAppliedJobs?.filter(app => app.status === 'pending').length || 0,
        accepted: allAppliedJobs?.filter(app => app.status === 'accepted').length || 0,
        rejected: allAppliedJobs?.filter(app => app.status === 'rejected').length || 0,
        waitlist: allAppliedJobs?.filter(app => app.status === 'waitlist').length || 0,
    };
    
    // Filter and search functionality
    useEffect(() => {
        let filtered = allAppliedJobs || [];
        
        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(app => app.status?.toLowerCase() === statusFilter.toLowerCase());
        }
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(app => 
                app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job?.location?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Sort applications
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'company':
                    return (a.job?.company?.name || '').localeCompare(b.job?.company?.name || '');
                case 'position':
                    return (a.job?.title || '').localeCompare(b.job?.title || '');
                default:
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });
        
        setFilteredApplications(filtered);
    }, [allAppliedJobs, searchTerm, statusFilter, sortBy]);
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
                    <p className="text-gray-600">Track and manage all your job applications in one place</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending</CardTitle>
                            <Clock className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Waitlist</CardTitle>
                            <HourglassIcon className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.waitlist}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                            <XCircle className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters and Search */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filters & Search
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by job title, company, or location..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            {/* Status Filter */}
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="waitlist">Waitlist</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            {/* Sort By */}
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full md:w-[180px]">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                    <SelectItem value="oldest">Oldest First</SelectItem>
                                    <SelectItem value="company">Company A-Z</SelectItem>
                                    <SelectItem value="position">Position A-Z</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Applications List */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Applications ({filteredApplications.length})</CardTitle>
                                <CardDescription>
                                    Your job application history and current status
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredApplications.length > 0 ? (
                            <div className="space-y-4">
                                {filteredApplications.map((application) => (
                                    <Card key={application._id} className="border border-gray-200 hover:border-primary-200 transition-all hover:shadow-md">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-4 flex-1">
                                                    {/* Company Logo */}
                                                    <Avatar className="h-12 w-12 rounded-lg border border-gray-200 flex-shrink-0">
                                                        <AvatarImage src={application.job?.company?.logo} alt={application.job?.company?.name} />
                                                        <AvatarFallback className="rounded-lg bg-primary-100 text-primary-700 text-sm">
                                                            {application.job?.company?.name?.substring(0, 2).toUpperCase() || "CO"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    
                                                    {/* Job Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-start justify-between mb-2">
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                                    {application.job?.title}
                                                                </h3>
                                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                                    <div className="flex items-center gap-1">
                                                                        <Building2 className="h-4 w-4" />
                                                                        {application.job?.company?.name}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="h-4 w-4" />
                                                                        {application.job?.location || "Remote"}
                                                                    </div>
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="h-4 w-4" />
                                                                        Applied {getDaysAgo(application.createdAt)}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Status */}
                                                            <div className="flex items-center gap-2">
                                                                {getStatusIcon(application.status)}
                                                                {getStatusBadge(application.status)}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Job Description Preview */}
                                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                            {application.job?.description}
                                                        </p>
                                                        
                                                        {/* Job Details */}
                                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                                            <span className="font-medium">
                                                                ₹{application.job?.salary} LPA
                                                            </span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {application.job?.jobType}
                                                            </Badge>
                                                            <Badge variant="outline" className="text-xs">
                                                                {application.job?.experienceLevel} Experience
                                                            </Badge>
                                                        </div>

                                                        {/* Contact Number */}
                                                        {application.job?.contactNumber && (
                                                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <Phone className="h-4 w-4 text-green-600" />
                                                                        <span className="text-sm font-medium text-green-800">Contact Employer</span>
                                                                    </div>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="h-7 px-2 text-xs border-green-300 text-green-700 hover:bg-green-100"
                                                                        onClick={() => window.open(`tel:${application.job?.contactNumber}`, '_self')}
                                                                    >
                                                                        <Phone className="h-3 w-3 mr-1" />
                                                                        Call Now
                                                                    </Button>
                                                                </div>
                                                                <p className="text-sm text-green-700 mt-1 font-medium">{application.job?.contactNumber}</p>
                                                                <p className="text-xs text-green-600 mt-1">Call to follow up on your application</p>
                                                            </div>
                                                        )}
                                                        
                                                        {/* Actions */}
                                                        <div className="flex items-center gap-3">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => navigate(`/description/${application.job?._id}`)}
                                                                className="flex items-center gap-1"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                View Job
                                                            </Button>
                                                            
                                                            {application.job?.company?.website && (
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm"
                                                                    onClick={() => window.open(application.job.company.website, '_blank')}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    <ExternalLink className="h-4 w-4" />
                                                                    Company Website
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Briefcase className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm || statusFilter !== 'all' ? 'No matching applications' : 'No applications yet'}
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || statusFilter !== 'all' 
                                        ? 'Try adjusting your search or filter criteria' 
                                        : "You haven't applied to any jobs yet. Start exploring opportunities!"
                                    }
                                </p>
                                {(!searchTerm && statusFilter === 'all') && (
                                    <Button 
                                        onClick={() => navigate('/jobs')}
                                        className="bg-primary-600 hover:bg-primary-700"
                                    >
                                        Browse Jobs
                                    </Button>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default MyApplications 