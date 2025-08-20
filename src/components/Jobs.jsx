import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Briefcase, Search } from 'lucide-react';
import Footer from './shared/Footer';
import { Input } from './ui/input';
import { Button } from './ui/button';

// const jobsArray = [1, 2, 3, 4, 5, 6, 7, 8];

const Jobs = () => {
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allJobs);
    const [localSearch, setLocalSearch] = useState('');
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (localSearch) {
            const filteredJobs = allJobs.filter((job) => {
                const searchText = localSearch.toLowerCase();
                return job.title.toLowerCase().includes(searchText) ||
                    job.description.toLowerCase().includes(searchText) ||
                    (job.location && job.location.toLowerCase().includes(searchText)) ||
                    (job.company && job.company.name && job.company.name.toLowerCase().includes(searchText));
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    };

    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) => {
                return job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                    (job.location && job.location.toLowerCase().includes(searchedQuery.toLowerCase())) ||
                    (job.company && job.company.name && job.company.name.toLowerCase().includes(searchedQuery.toLowerCase()));
            });
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <div className="bg-blue-50 border-b border-blue-100">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Find Blue-Collar Jobs
                        </h1>
                        <p className="text-gray-600 max-w-2xl mb-6">
                            Browse through thousands of job opportunities across various industries for skilled workers
                        </p>
                        
                        <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input 
                                    type="text" 
                                    placeholder="Search by job title, company, or location..." 
                                    className="pl-10 py-6 border-gray-200 focus:ring-blue-500 focus:border-blue-500"
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                Search
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
            
            <main className="flex-grow bg-gray-50">
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    <div className='flex flex-col md:flex-row gap-6'>
                        <div className='w-full md:w-72 lg:w-80'>
                            <FilterCard />
                        </div>
                        
                        <div className='flex-1'>
                            {filterJobs.length > 0 ? (
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-blue-600" />
                                            <h2 className="text-xl font-bold text-gray-900">
                                                {filterJobs.length} {filterJobs.length === 1 ? 'Job' : 'Jobs'} Available
                                            </h2>
                                        </div>
                                    </div>
                                    
                                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                                        {filterJobs.map((job) => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.3 }}
                                                key={job?._id}
                                            >
                                                <Job job={job} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                                    <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                        <Briefcase className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                                    <p className="text-gray-600 mb-6">
                                        We couldn't find any jobs matching your search criteria. Try adjusting your filters or search terms.
                                    </p>
                                    <Button 
                                        variant="outline" 
                                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                                        onClick={() => {
                                            setLocalSearch('');
                                            setFilterJobs(allJobs);
                                        }}
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            
            <Footer />
        </div>
    )
}

export default Jobs