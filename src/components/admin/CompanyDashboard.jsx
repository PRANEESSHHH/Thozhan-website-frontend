import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { setSearchJobByText } from '@/redux/jobSlice'
import { Search, Plus, Building2, Briefcase, Users, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Alert, AlertDescription } from '../ui/alert'
import CompaniesTable from './CompaniesTable'
import AdminJobsTable from './AdminJobsTable'
import { toast } from 'sonner'

const CompanyDashboard = () => {
    // Always call hooks at the top level - never inside conditions
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // State management - always at the top
    const [activeTab, setActiveTab] = useState("companies");
    const [companyInput, setCompanyInput] = useState("");
    const [jobInput, setJobInput] = useState("");
    const [showDebugInfo, setShowDebugInfo] = useState(false);
    
    // Always call custom hooks at the top level
    const { refetch: refetchCompanies, error: companyError, loading: companyLoading } = useGetAllCompanies();
    const { refetch: refetchJobs, error: jobError, loading: jobLoading } = useGetAllAdminJobs();
    
    // Always call useSelector hooks at the top level
    const { companies } = useSelector(store => store.company);
    const { allAdminJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    // Update search filters
    useEffect(() => {
        dispatch(setSearchCompanyByText(companyInput));
    }, [companyInput, dispatch]);

    useEffect(() => {
        dispatch(setSearchJobByText(jobInput));
    }, [jobInput, dispatch]);

    // Calculate stats
    const totalCompanies = companies?.length || 0;
    const activeCompanies = companies?.filter(company => company.isActive !== false)?.length || 0;
    const totalJobs = allAdminJobs?.length || 0;
    const activeJobs = allAdminJobs?.filter(job => job.isActive !== false)?.length || 0;
    const totalApplications = allAdminJobs?.reduce((sum, job) => sum + (job.applications?.length || 0), 0) || 0;
    const recentCompanies = companies?.filter(company => {
        const companyDate = new Date(company.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return companyDate >= weekAgo;
    })?.length || 0;

    const handleRefreshAll = () => {
        toast.info("Refreshing data...");
        refetchCompanies();
        refetchJobs();
    };

    const testBackendConnection = async () => {
        try {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://thozhan-website-backend.onrender.com";
            const response = await fetch(`${API_BASE_URL}/api/test`);
            const data = await response.json();
            if (data.success) {
                toast.success("Backend connection successful!");
            } else {
                toast.error("Backend responded but with an error");
            }
        } catch (error) {
            toast.error("Cannot connect to backend server. Please ensure it's running on port 3000.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8'>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Dashboard</h1>
                        <p className="text-gray-600">Manage your companies and job postings</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0">
                        <Button 
                            onClick={handleRefreshAll}
                            variant="outline"
                            className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh Data
                        </Button>
                        <Button 
                            onClick={() => navigate("/admin/companies/create")}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Company
                        </Button>
                        <Button 
                            onClick={() => navigate("/admin/jobs/create")}
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Post Job
                        </Button>
                    </div>
                </div>

                {/* Debug Information */}
                <div className="mb-6">
                    <Button 
                        onClick={() => setShowDebugInfo(!showDebugInfo)}
                        variant="outline"
                        size="sm"
                        className="mb-3"
                    >
                        {showDebugInfo ? 'Hide' : 'Show'} Debug Info
                    </Button>
                    
                    {showDebugInfo && (
                        <Card className="mb-4">
                            <CardHeader>
                                <CardTitle className="text-lg">Debug Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-medium mb-2">User Info:</h4>
                                        <p className="text-sm">ID: {user?._id}</p>
                                        <p className="text-sm">Role: {user?.role}</p>
                                        <p className="text-sm">Email: {user?.email}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium mb-2">Data Status:</h4>
                                        <p className="text-sm">Companies: {companies?.length || 0} loaded</p>
                                        <p className="text-sm">Jobs: {allAdminJobs?.length || 0} loaded</p>
                                        <p className="text-sm">Company Loading: {companyLoading ? 'Yes' : 'No'}</p>
                                        <p className="text-sm">Jobs Loading: {jobLoading ? 'Yes' : 'No'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={testBackendConnection} size="sm" variant="outline">
                                        Test Backend Connection
                                    </Button>
                                    <Button onClick={() => console.log('Companies:', companies, 'Jobs:', allAdminJobs)} size="sm" variant="outline">
                                        Log Data to Console
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Error Alerts */}
                {(companyError || jobError) && (
                    <Alert className="mb-6 border-red-200 bg-red-50">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            {companyError && <div>Company Error: {companyError.message}</div>}
                            {jobError && <div>Job Error: {jobError.message}</div>}
                            <Button onClick={handleRefreshAll} className="mt-2" size="sm">
                                Retry Loading Data
                            </Button>
                        </AlertDescription>
                    </Alert>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Companies</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalCompanies}</div>
                            <p className="text-xs text-gray-500">Total registered companies</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Job Posts</CardTitle>
                            <Briefcase className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
                            <p className="text-xs text-gray-500">Total job listings</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Applications</CardTitle>
                            <Users className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalApplications}</div>
                            <p className="text-xs text-gray-500">Total received applications</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Jobs</CardTitle>
                            <TrendingUp className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{activeJobs}</div>
                            <p className="text-xs text-gray-500">Currently active job posts</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for Companies and Jobs */}
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="companies" className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" /> Companies
                        </TabsTrigger>
                        <TabsTrigger value="jobs" className="flex items-center gap-1">
                            <Briefcase className="h-4 w-4" /> Job Postings
                        </TabsTrigger>
                    </TabsList>
                    
                    {/* Companies Tab Content */}
                    <TabsContent value="companies" className="space-y-4">
                        {/* Search and Filter */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className='flex flex-col sm:flex-row items-center gap-4'>
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            className="pl-10"
                                            placeholder="Search companies by name..."
                                            value={companyInput}
                                            onChange={(e) => setCompanyInput(e.target.value)}
                                        />
                                    </div>
                                    <Button 
                                        onClick={refetchCompanies}
                                        variant="outline"
                                        className="border-green-200 text-green-600 hover:bg-green-50"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => navigate("/admin/companies/create")}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Company
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Companies Table */}
                        <Card>
                            <CardContent className="p-0">
                                <CompaniesTable />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Jobs Tab Content */}
                    <TabsContent value="jobs" className="space-y-4">
                        {/* Search and Filter */}
                        <Card className="mb-6">
                            <CardContent className="pt-6">
                                <div className='flex flex-col sm:flex-row items-center gap-4'>
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            className="pl-10"
                                            placeholder="Search by job title, company name..."
                                            value={jobInput}
                                            onChange={(e) => setJobInput(e.target.value)}
                                        />
                                    </div>
                                    <Button 
                                        onClick={refetchJobs}
                                        variant="outline"
                                        className="border-green-200 text-green-600 hover:bg-green-50"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        onClick={() => navigate("/admin/jobs/create")}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Post Job
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default CompanyDashboard 