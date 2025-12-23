import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import axios from '@/utils/axios'
import { toast } from 'sonner'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, CheckCircle, XCircle, Clock, HourglassIcon, Building2, Calendar, Users } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

const shortlistingStatus = ["accepted", "rejected", "waitlist", "pending"];

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'accepted':
            return <CheckCircle className="w-4 h-4 text-green-600" />;
        case 'rejected':
            return <XCircle className="w-4 h-4 text-red-600" />;
        case 'waitlist':
            return <HourglassIcon className="w-4 h-4 text-yellow-600" />;
        case 'pending':
        default:
            return <Clock className="w-4 h-4 text-blue-600" />;
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

const Applications = () => {
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        waitlist: 0
    });

    useEffect(() => {
        fetchAllApplications();
    }, []);

    useEffect(() => {
        filterApplications();
        calculateStats();
    }, [applications, statusFilter]);

    const fetchAllApplications = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${APPLICATION_API_END_POINT}/employer/all`);
            
            if (res.data.success) {
                setApplications(res.data.applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to fetch applications');
        } finally {
            setLoading(false);
        }
    };

    const filterApplications = () => {
        if (statusFilter === 'all') {
            setFilteredApplications(applications);
        } else {
            setFilteredApplications(applications.filter(app => 
                app.status?.toLowerCase() === statusFilter.toLowerCase()
            ));
        }
    };

    const calculateStats = () => {
        const newStats = {
            total: applications.length,
            pending: applications.filter(app => app.status === 'pending').length,
            accepted: applications.filter(app => app.status === 'accepted').length,
            rejected: applications.filter(app => app.status === 'rejected').length,
            waitlist: applications.filter(app => app.status === 'waitlist').length,
        };
        setStats(newStats);
    };

    const statusHandler = async (status, applicationId) => {
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, 
                { status }
            );
            
            if (res.data.success) {
                // Update local state
                setApplications(prevApps => 
                    prevApps.map(app => 
                        app._id === applicationId 
                            ? { ...app, status: status.toLowerCase() }
                            : app
                    )
                );
                toast.success(`Application ${status.toLowerCase()} successfully!`);
            }
        } catch (error) {
            console.error('Status update error:', error);
            toast.error(error.response?.data?.message || 'Failed to update status');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading applications...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
                    <p className="text-gray-600">Manage all job applications across your postings</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
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

                {/* Applications Table with Filters */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>All Applications</CardTitle>
                                <CardDescription>
                                    Review and manage job applications from candidates
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Status Filter Tabs */}
                        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
                                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                                <TabsTrigger value="accepted">Accepted ({stats.accepted})</TabsTrigger>
                                <TabsTrigger value="waitlist">Waitlist ({stats.waitlist})</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
                            </TabsList>
                        </Tabs>

                        {/* Applications Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">Applicant</TableHead>
                                        <TableHead className="font-semibold">Job Title</TableHead>
                                        <TableHead className="font-semibold">Company</TableHead>
                                        <TableHead className="font-semibold">Email</TableHead>
                                        <TableHead className="font-semibold">Phone</TableHead>
                                        <TableHead className="font-semibold">Applied Date</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="text-right font-semibold">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredApplications.length > 0 ? (
                                        filteredApplications.map((application) => (
                                            <TableRow key={application._id} className="hover:bg-gray-50">
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-medium">{application.applicant?.fullname}</span>
                                                        {application.applicant?.profile?.resume && (
                                                            <a 
                                                                href={application.applicant.profile.resume}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-blue-600 hover:text-blue-800 underline"
                                                            >
                                                                View Resume
                                                            </a>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {application.job?.title}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4" />
                                                        {application.job?.company?.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {application.applicant?.email}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    {application.applicant?.phoneNumber || 'N/A'}
                                                </TableCell>
                                                <TableCell className="text-gray-600">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        {formatDate(application.createdAt)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(application.status)}
                                                        {getStatusBadge(application.status)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Popover>
                                                        <PopoverTrigger className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-48 p-2">
                                                            <div className="space-y-1">
                                                                {shortlistingStatus.map((status, index) => {
                                                                    const isCurrentStatus = status.toLowerCase() === application.status?.toLowerCase();
                                                                    return (
                                                                        <div 
                                                                            key={index}
                                                                            onClick={() => !isCurrentStatus && statusHandler(status, application._id)} 
                                                                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                                                                                isCurrentStatus 
                                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                                    : 'hover:bg-gray-100'
                                                                            }`}
                                                                        >
                                                                            {getStatusIcon(status)}
                                                                            <span className="capitalize font-medium">
                                                                                {status}
                                                                            </span>
                                                                            {isCurrentStatus && (
                                                                                <span className="text-xs text-gray-500 ml-auto">Current</span>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-12">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Users className="h-12 w-12 text-gray-400" />
                                                    <h3 className="font-medium text-gray-900">No applications found</h3>
                                                    <p className="text-gray-500">
                                                        {statusFilter === 'all' 
                                                            ? "You haven't received any applications yet." 
                                                            : `No ${statusFilter} applications found.`
                                                        }
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Applications 