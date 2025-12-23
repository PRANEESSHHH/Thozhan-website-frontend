import React, { useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, CheckCircle, XCircle, Clock, HourglassIcon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { setAllApplicants } from '@/redux/applicationSlice';
import { useNavigate } from 'react-router-dom';

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

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const { isAuthenticated } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const statusHandler = async (status, applicationId) => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            toast.error('Please log in to update application status');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status },{withCredentials:true});

            if (res.data.success) {
                // Update the local state to reflect the change
                const updatedApplications = {
                    ...applicants,
                    applications: applicants.applications.map(app =>
                        app._id === applicationId
                            ? { ...app, status: status.toLowerCase() }
                            : app
                    )
                };
                dispatch(setAllApplicants(updatedApplications));

                toast.success(`Application ${status.toLowerCase()} successfully!`);
            }
        } catch (error) {
            console.error('Status update error:', error);
            if (error.response?.status === 401) {
                toast.error('Authentication failed. Please log in again.');
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || 'Failed to update status');
            }
        } finally {
            setLoading(false);
        }
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <Table>
                <TableCaption className="text-gray-600">
                    Manage applications for your job postings
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">Applicant</TableHead>
                        <TableHead className="font-semibold">Email</TableHead>
                        <TableHead className="font-semibold">Contact</TableHead>
                        <TableHead className="font-semibold">Resume</TableHead>
                        <TableHead className="font-semibold">Applied Date</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.length > 0 ? (
                        applicants.applications.map((item) => (
                            <TableRow key={item._id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    {item?.applicant?.fullname || 'N/A'}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {item?.applicant?.email || 'N/A'}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {item?.applicant?.phoneNumber || 'N/A'}
                                </TableCell>
                                <TableCell>
                                    {item.applicant?.profile?.resume ? (
                                        <a 
                                            className="text-blue-600 hover:text-blue-800 cursor-pointer underline" 
                                            href={item?.applicant?.profile?.resume} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {item?.applicant?.profile?.resumeOriginalName || 'View Resume'}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400">No Resume</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-gray-600">
                                    {formatDate(item?.createdAt)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(item?.status)}
                                        {getStatusBadge(item?.status)}
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
                                                    const isCurrentStatus = status.toLowerCase() === item?.status?.toLowerCase();
                                                    return (
                                                        <div 
                                                            key={index}
                                                            onClick={() => !isCurrentStatus && !loading && statusHandler(status, item?._id)} 
                                                            className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                                                                isCurrentStatus 
                                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                    : 'hover:bg-gray-100'
                                                            } ${loading ? 'pointer-events-none opacity-50' : ''}`}
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
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                No applications found for this job.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable