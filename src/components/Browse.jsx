import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import Footer from './shared/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import useSavedJobs from '@/hooks/useSavedJobs';
import { 
    Search, 
    MapPin, 
    Briefcase,
    SlidersHorizontal,
    XCircle,
    Clock,
    DollarSign,
    Filter,
    Bookmark,
    AlertTriangle
} from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
    Sheet, 
    SheetContent, 
    SheetHeader, 
    SheetTitle, 
    SheetTrigger,
    SheetClose,
    SheetFooter
} from './ui/sheet';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Temporary'];
const experienceLevels = ['Entry Level', '1-3 years', '3-5 years', '5+ years'];
const salaryRanges = ['0-3 LPA', '3-6 LPA', '6-10 LPA', '10+ LPA'];
const categories = ['Construction', 'Driving', 'Factory', 'Mechanic', 'Electrician', 'Plumbing', 'Security', 'Cleaning', 'Others'];

const Browse = () => {
    useGetAllJobs();
    const { allJobs, searchedQuery } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);
    const { savedJobs, isLoading: savedJobsLoading, error: savedJobsError } = useSavedJobs();
    const dispatch = useDispatch();
    
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchedQuery || "");
    const [location, setLocation] = useState("");
    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedSalaryRange, setSelectedSalaryRange] = useState("");
    const [showSavedOnly, setShowSavedOnly] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Handle job type selection
    const toggleJobType = (type) => {
        setSelectedJobTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type) 
                : [...prev, type]
        );
    };

    // Handle category selection
    const toggleCategory = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        );
    };

    // Toggle saved jobs filter
    const toggleSavedJobs = () => {
        if (savedJobsError && !showSavedOnly) {
            return; // Don't allow enabling saved jobs filter if there's an error
        }
        
        setShowSavedOnly(prev => !prev);
        applyFilters(!showSavedOnly);
    };

    // Apply filters
    const applyFilters = (savedOnlyOverride = null) => {
        setIsFiltering(true);
        let results = [...allJobs];
        
        // First filter by saved jobs if selected (and no error)
        const shouldFilterSaved = savedOnlyOverride !== null ? savedOnlyOverride : showSavedOnly;
        if (shouldFilterSaved && user && !savedJobsError) {
            results = results.filter(job => savedJobs.includes(job._id));
        }
        
        // Filter by search query
        if (localSearchQuery) {
            results = results.filter(job => 
                job.title.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                job.description.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
                job.company.name.toLowerCase().includes(localSearchQuery.toLowerCase())
            );
        }
        
        // Filter by location
        if (location) {
            results = results.filter(job => 
                job.location && job.location.toLowerCase().includes(location.toLowerCase())
            );
        }
        
        // Filter by job type
        if (selectedJobTypes.length > 0) {
            results = results.filter(job => selectedJobTypes.includes(job.jobType));
        }
        
        // Filter by category (assuming jobs have categories)
        if (selectedCategories.length > 0) {
            results = results.filter(job => 
                job.category && selectedCategories.includes(job.category)
            );
        }
        
        // Filter by salary range
        if (selectedSalaryRange) {
            const [min, max] = selectedSalaryRange.split('-').map(val => 
                val.includes('+') ? Infinity : Number(val.replace(' LPA', ''))
            );
            
            results = results.filter(job => {
                const salary = Number(job.salary);
                return salary >= min && (max === Infinity || salary <= max);
            });
        }
        
        setFilteredJobs(results);
    };

    // Reset filters
    const resetFilters = () => {
        setLocalSearchQuery("");
        setLocation("");
        setSelectedJobTypes([]);
        setSelectedCategories([]);
        setSelectedSalaryRange("");
        setShowSavedOnly(false);
        setIsFiltering(false);
        setFilteredJobs(allJobs);
    };

    // Handle search submission
    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters();
    };

    // Initialize and update filtered jobs
    useEffect(() => {
        if (allJobs.length > 0) {
            setFilteredJobs(allJobs);
            setIsLoading(false);
        }
    }, [allJobs]);

    // Clean up search query on unmount
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, []);

    // Initialize local search query from redux state
    useEffect(() => {
        if (searchedQuery) {
            setLocalSearchQuery(searchedQuery);
            applyFilters();
        }
    }, [searchedQuery]);

    // Reapply filters when savedJobs changes
    useEffect(() => {
        if (showSavedOnly) {
            applyFilters();
        }
    }, [savedJobs]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="flex-grow">
                <div className='max-w-7xl mx-auto px-4 py-8'>
                    {/* Error alert - Show only if there's an error with saved jobs */}
                    {savedJobsError && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Issue with saved jobs</AlertTitle>
                            <AlertDescription>
                                We're having trouble loading your saved jobs. You can still browse all jobs, but saving and filtering by saved jobs may not work correctly.
                            </AlertDescription>
                        </Alert>
                    )}
                
                    {/* Search and filter section */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input 
                                    type="text" 
                                    placeholder="Search jobs, companies, or keywords" 
                                    className="pl-10 pr-4 py-2 w-full" 
                                    value={localSearchQuery}
                                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="relative md:w-1/4">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input 
                                    type="text" 
                                    placeholder="Location" 
                                    className="pl-10 pr-4 py-2 w-full" 
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Search</Button>
                        </form>
                        
                        <div className="flex flex-wrap items-center justify-between mt-4">
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {/* Filter badges/chips */}
                                {localSearchQuery && (
                                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                                        <span>{localSearchQuery}</span>
                                        <XCircle 
                                            className="h-4 w-4 cursor-pointer hover:text-red-500"
                                            onClick={() => {
                                                setLocalSearchQuery("");
                                                applyFilters();
                                            }}
                                        />
                                    </Badge>
                                )}
                                
                                {location && (
                                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                                        <MapPin className="h-3 w-3" />
                                        <span>{location}</span>
                                        <XCircle 
                                            className="h-4 w-4 cursor-pointer hover:text-red-500"
                                            onClick={() => {
                                                setLocation("");
                                                applyFilters();
                                            }}
                                        />
                                    </Badge>
                                )}
                                
                                {selectedJobTypes.map(type => (
                                    <Badge key={type} variant="outline" className="flex items-center gap-1 px-3 py-1">
                                        <Briefcase className="h-3 w-3" />
                                        <span>{type}</span>
                                        <XCircle 
                                            className="h-4 w-4 cursor-pointer hover:text-red-500"
                                            onClick={() => {
                                                toggleJobType(type);
                                                applyFilters();
                                            }}
                                        />
                                    </Badge>
                                ))}
                                
                                {selectedSalaryRange && (
                                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                                        <DollarSign className="h-3 w-3" />
                                        <span>{selectedSalaryRange}</span>
                                        <XCircle 
                                            className="h-4 w-4 cursor-pointer hover:text-red-500"
                                            onClick={() => {
                                                setSelectedSalaryRange("");
                                                applyFilters();
                                            }}
                                        />
                                    </Badge>
                                )}
                                
                                {showSavedOnly && (
                                    <Badge variant="outline" className="flex items-center gap-1 px-3 py-1 bg-blue-50">
                                        <Bookmark className="h-3 w-3 text-blue-600" />
                                        <span className="text-blue-600">Saved Jobs Only</span>
                                        <XCircle 
                                            className="h-4 w-4 cursor-pointer hover:text-red-500"
                                            onClick={() => {
                                                setShowSavedOnly(false);
                                                applyFilters(false);
                                            }}
                                        />
                                    </Badge>
                                )}
                                
                                {isFiltering && (
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={resetFilters}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        Clear All
                                    </Button>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className={`flex items-center gap-1 ${savedJobsError ? 'opacity-50 cursor-not-allowed' : ''} ${showSavedOnly ? 'border-blue-500 bg-blue-50 text-blue-700' : ''}`}
                                    onClick={toggleSavedJobs}
                                    disabled={savedJobsError}
                                >
                                    <Bookmark className="h-4 w-4" />
                                    Saved Jobs
                                </Button>
                                
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <Filter className="h-4 w-4" />
                                            Filters
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent>
                                        <SheetHeader>
                                            <SheetTitle>Filter Jobs</SheetTitle>
                                        </SheetHeader>
                                        <div className="py-4 space-y-6">
                                            <div>
                                                <h3 className="font-medium mb-3">Job Type</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {jobTypes.map(type => (
                                                        <div key={type} className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`job-type-${type}`} 
                                                                checked={selectedJobTypes.includes(type)}
                                                                onCheckedChange={() => toggleJobType(type)}
                                                            />
                                                            <Label htmlFor={`job-type-${type}`}>{type}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <Separator />
                                            
                                            <div>
                                                <h3 className="font-medium mb-3">Salary Range</h3>
                                                <Select value={selectedSalaryRange} onValueChange={setSelectedSalaryRange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select salary range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {salaryRanges.map(range => (
                                                            <SelectItem key={range} value={range}>{range}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            
                                            <Separator />
                                            
                                            <div>
                                                <h3 className="font-medium mb-3">Category</h3>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {categories.map(category => (
                                                        <div key={category} className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`category-${category}`} 
                                                                checked={selectedCategories.includes(category)}
                                                                onCheckedChange={() => toggleCategory(category)}
                                                            />
                                                            <Label htmlFor={`category-${category}`}>{category}</Label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <SheetFooter>
                                            <SheetClose asChild>
                                                <Button className="w-full" onClick={() => applyFilters()}>Apply Filters</Button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                    
                    {/* Job listing count */}
                    {!isLoading && (
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
                            </h2>
                        </div>
                    )}
                    
                    {/* Loading state */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Loading jobs...</p>
                        </div>
                    )}
                    
                    {/* Empty state */}
                    {!isLoading && filteredJobs.length === 0 && (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                {showSavedOnly ? (
                                    <Bookmark className="h-8 w-8 text-blue-600" />
                                ) : (
                                    <Search className="h-8 w-8 text-blue-600" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                {showSavedOnly ? 'No saved jobs yet' : 'No jobs found'}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {showSavedOnly 
                                    ? 'Start saving jobs you are interested in by clicking the bookmark icon' 
                                    : 'We couldn\'t find any jobs matching your search criteria.'}
                            </p>
                            <Button onClick={resetFilters} className="bg-blue-600 hover:bg-blue-700">
                                {showSavedOnly ? 'Browse All Jobs' : 'Reset Filters'}
                            </Button>
                        </div>
                    )}

                    {/* Job listings */}
                    {!isLoading && filteredJobs.length > 0 && (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {filteredJobs.map((job) => (
                                <Job key={job._id} job={job}/>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            <Footer />
        </div>
    )
}

export default Browse