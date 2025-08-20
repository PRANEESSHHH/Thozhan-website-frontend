import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building2, AlertCircle, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText, loading } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const filteredCompany = companies.filter((company) => {
            if (!searchCompanyByText) {
                return true;
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    }, [companies, searchCompanyByText]);
    
    // Get company initial for avatar fallback
    const getCompanyInitial = (name) => {
        if (!name) return 'C';
        return name.charAt(0).toUpperCase();
    };
    
    // Render loading state
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading companies...</p>
            </div>
        );
    }
    
    // Render empty state
    if (filterCompany.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-gray-50">
                <Building2 className="h-12 w-12 text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                    {searchCompanyByText ? 'No matching companies found' : 'No companies yet'}
                </h3>
                <p className="text-gray-500 text-center max-w-md mb-6">
                    {searchCompanyByText
                        ? `We couldn't find any companies matching "${searchCompanyByText}". Try a different search term.`
                        : 'You haven\'t added any companies yet. Create your first company to get started.'}
                </p>
                <button 
                    onClick={() => navigate('/admin/companies/create')} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Add Company
                </button>
            </div>
        );
    }
    
    return (
        <div className="rounded-md border">
            <Table>
                <TableCaption>A list of your registered companies</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Logo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterCompany.map((company, index) => {
                        // Ensure we have a unique key even if _id is undefined
                        const uniqueKey = company._id || `company-${index}`;
                        
                        return (
                            <TableRow 
                                key={uniqueKey} 
                                className="hover:bg-gray-50 cursor-pointer" 
                                onClick={() => navigate(`/admin/companies/${company._id}`)}
                            >
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={company.logo} alt={company.name} />
                                        <AvatarFallback className="bg-blue-100 text-blue-600">
                                            {getCompanyInitial(company.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium">{company.name}</TableCell>
                                <TableCell>{new Date(company.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger onClick={(e) => e.stopPropagation()}>
                                            <div className="rounded-full p-2 hover:bg-gray-100 inline-flex">
                                                <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40" onClick={(e) => e.stopPropagation()}>
                                            <div 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/admin/companies/${company._id}`);
                                                }} 
                                                className='flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer'
                                            >
                                                <Edit2 className='w-4 h-4 text-blue-600' />
                                                <span>Edit Company</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable