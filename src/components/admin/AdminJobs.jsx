import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button' 
import { useNavigate } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux' 
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Search, Plus, Briefcase, Users, Eye, TrendingUp, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allAdminJobs } = useSelector(store => store.job);

  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input, dispatch]);

  // Calculate stats
  const totalJobs = allAdminJobs?.length || 0;
  const activeJobs = allAdminJobs?.filter(job => job.isActive !== false)?.length || 0;
  const totalApplications = allAdminJobs?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0;
  const recentJobs = allAdminJobs?.filter(job => {
    const jobDate = new Date(job.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return jobDate >= weekAgo;
  })?.length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8'>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Job Posts</h1>
            <p className="text-gray-600">Manage and track your job postings</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
            <Button 
              variant="outline"
              onClick={() => navigate("/admin/all-employers-jobs")}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              <Building2 className="w-4 h-4 mr-2" />
              View All Employers Jobs
            </Button>
            <Button 
              onClick={() => navigate("/admin/jobs/create")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
              <p className="text-xs text-gray-500">All time job posts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{activeJobs}</div>
              <p className="text-xs text-gray-500">Currently accepting applications</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{totalApplications}</div>
              <p className="text-xs text-gray-500">Across all job posts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
              <Eye className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{recentJobs}</div>
              <p className="text-xs text-gray-500">New jobs posted</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
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
              <Button 
                variant="outline"
                onClick={() => navigate("/admin/jobs/create")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Job
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardContent className="p-0">
            <AdminJobsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminJobs