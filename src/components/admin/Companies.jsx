import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import { Search, Plus, Building2, Briefcase, Users, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { companies } = useSelector(store => store.company);
    const { allAdminJobs } = useSelector(store => store.job);

    useEffect(()=>{
        dispatch(setSearchCompanyByText(input));
    },[input]);

    // Calculate stats
    const totalCompanies = companies?.length || 0;
    const activeCompanies = companies?.filter(company => company.isActive !== false)?.length || 0;
    const totalJobs = allAdminJobs?.length || 0;
    const recentCompanies = companies?.filter(company => {
        const companyDate = new Date(company.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return companyDate >= weekAgo;
    })?.length || 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                {/* Header */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8'>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Companies</h1>
                        <p className="text-gray-600">Manage your company profiles and information</p>
                    </div>
                    <Button 
                        onClick={() => navigate("/admin/companies/create")}
                        className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Company
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Companies</CardTitle>
                            <Building2 className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalCompanies}</div>
                            <p className="text-xs text-gray-500">Registered companies</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active Companies</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{activeCompanies}</div>
                            <p className="text-xs text-gray-500">Currently active</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Job Posts</CardTitle>
                            <Briefcase className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
                            <p className="text-xs text-gray-500">Across all companies</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
                            <Users className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-gray-900">{recentCompanies}</div>
                            <p className="text-xs text-gray-500">New companies added</p>
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
                                    placeholder="Search companies by name..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                            </div>
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
                        <CompaniesTable/>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Companies