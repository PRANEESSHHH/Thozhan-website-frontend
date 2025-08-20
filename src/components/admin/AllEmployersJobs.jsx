import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllEmployersJobs from '@/hooks/useGetAllEmployersJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Search, ArrowLeft, Briefcase, Building2, Calendar, Eye, Loader2, MapPin, MoreHorizontal, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const AllEmployersJobs = () => {
  useGetAllEmployersJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allJobs, searchJobByText, loading } = useSelector(store => store.job);
  const [filterJobs, setFilterJobs] = useState([]);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  useEffect(() => {
    const filteredJobs = allJobs.filter((job) => {
      if(!searchJobByText) {
        return true;
      }
      return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
        job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
    });
    setFilterJobs(filteredJobs);
  }, [allJobs, searchJobByText]);

  // Stats calculations
  const totalEmployers = [...new Set(allJobs.map(job => job.company?._id))].length;
  const totalJobs = allJobs.length;
  const activeJobs = allJobs.filter(job => job.isActive !== false).length;
  const recentJobs = allJobs.filter(job => {
    const jobDate = new Date(job.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return jobDate >= weekAgo;
  }).length;

  // Utility functions
  const getCompanyInitials = (name) => {
    if (!name) return "CO";
    const words = name.split(" ");
    if (words.length === 1) return name.slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
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

  const getJobTypeColor = (jobType) => {
    switch(jobType) {
      case 'Full-Time':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Part-Time':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Contract':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'Temporary':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600">Loading all employer jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8'>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 h-8" 
                onClick={() => navigate('/admin/jobs')}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to My Jobs
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">All Employers Jobs</h1>
            <p className="text-gray-600">View and manage jobs posted by all employers</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Employers</CardTitle>
              <Building2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalEmployers}</div>
              <p className="text-xs text-gray-500">Registered companies</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
              <p className="text-xs text-gray-500">All job postings</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeJobs}</div>
              <p className="text-xs text-gray-500">Currently accepting applications</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
              <Calendar className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{recentJobs}</div>
              <p className="text-xs text-gray-500">New jobs posted</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className='flex flex-col sm:flex-row items-center gap-4'>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  className="pl-10"
                  placeholder="Search by job title, company name..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardContent className="p-0">
            {filterJobs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {searchJobByText ? 'No matching jobs found' : 'No jobs available'}
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                  {searchJobByText
                    ? `We couldn't find any jobs matching "${searchJobByText}". Try a different search term.`
                    : 'There are no jobs posted by any employers yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <Table>
                  <TableCaption>A list of all employer job posts</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company & Role</TableHead>
                      <TableHead>Job Details</TableHead>
                      <TableHead>Applications</TableHead>
                      <TableHead>Posted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filterJobs?.map((job) => (
                      <TableRow key={job._id} className="hover:bg-gray-50">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 rounded-lg border border-gray-200">
                              <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                              <AvatarFallback className="rounded-lg bg-blue-100 text-blue-600 font-medium">
                                {getCompanyInitials(job?.company?.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">{job?.title}</div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Building2 className="h-3 w-3 mr-1" />
                                {job?.company?.name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge className={getJobTypeColor(job?.jobType)}>
                                {job?.jobType}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="h-3 w-3 mr-1" />
                                {job?.location || 'India'}
                              </div>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {job?.position} Position{job?.position > 1 ? 's' : ''} • ₹{job?.salary} LPA
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-blue-600" />
                            <span className="font-medium text-gray-900">
                              {job?.applications?.length || 0}
                            </span>
                            <span className="text-sm text-gray-500">applicants</span>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <div>
                              <div>{formatDate(job?.createdAt)}</div>
                              <div className="text-xs text-gray-500">{getDaysAgo(job?.createdAt)}</div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-right py-4">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48" align="end">
                              <div className="space-y-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start h-8"
                                  onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                >
                                  <Users className='w-4 h-4 mr-2'/>
                                  View Applicants
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start h-8"
                                  onClick={() => navigate(`/description/${job._id}`)}
                                >
                                  <Eye className='w-4 h-4 mr-2'/>
                                  Preview Job
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AllEmployersJobs 