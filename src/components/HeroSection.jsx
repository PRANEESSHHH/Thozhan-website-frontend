import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search, Briefcase, ShieldCheck, Clock, MapPin } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/jobs");
    }

    return (
        <div className='relative overflow-hidden'>
            {/* Background with gradient overlay */}
            <div className='absolute inset-0 bg-gradient-to-r from-primary-900/90 to-primary-700/80 -z-10'></div>
            
            {/* Simplified background pattern */}
            <div className='absolute inset-0 opacity-30 -z-10' 
                 style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                          backgroundSize: '20px 20px' }}>
            </div>
            
            <div className='max-w-7xl mx-auto px-4 py-16 md:py-24'>
                <div className='flex flex-col md:flex-row gap-8 items-center'>
                    <div className='flex flex-col gap-6 md:w-1/2 text-left md:pr-8'>
                        <span className='inline-block px-4 py-2 rounded-full bg-white/10 text-white font-medium w-fit backdrop-blur-sm border border-white/20'>Your Skills, Your Future</span>
                        <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white font-display'>Find Quality <span className='text-warning-300'>Blue-Collar Jobs</span> Near You</h1>
                        <p className='text-white/90 text-lg md:text-xl'>Connecting skilled workers with trusted employers for construction, manufacturing, transportation, and service jobs.</p>
                        
                        <div className='flex w-full shadow-lg border border-white/20 rounded-full items-center bg-white/10 backdrop-blur-sm overflow-hidden'>
                            <div className='flex items-center pl-4 flex-1'>
                                <Search className='h-5 w-5 text-white mr-3' />
                            <input
                                type="text"
                                placeholder='Search jobs (electrician, plumber, driver...)'
                                onChange={(e) => setQuery(e.target.value)}
                                    className='outline-none border-none w-full py-4 bg-transparent text-white placeholder:text-white/70'
                            />
                            </div>
                            <Button onClick={searchJobHandler} className="bg-warning-500 hover:bg-warning-600 text-gray-900 font-medium px-6 py-4 rounded-none rounded-r-full h-full">
                                Search Jobs
                            </Button>
                        </div>

                        <div className='grid grid-cols-3 gap-4 mt-4'>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 rounded-full bg-white/10 backdrop-blur-sm'>
                                    <Briefcase className='h-5 w-5 text-warning-300' />
                                </div>
                                <span className='text-sm text-white'>1000+ Jobs</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 rounded-full bg-white/10 backdrop-blur-sm'>
                                    <ShieldCheck className='h-5 w-5 text-warning-300' />
                                </div>
                                <span className='text-sm text-white'>Verified Employers</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <div className='p-2 rounded-full bg-white/10 backdrop-blur-sm'>
                                    <Clock className='h-5 w-5 text-warning-300' />
                                </div>
                                <span className='text-sm text-white'>Quick Apply</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className='md:w-1/2 flex items-center justify-center'>
                        <div className='relative'>
                            <div className='absolute -inset-0.5 bg-gradient-to-r from-warning-400 to-warning-600 rounded-lg blur opacity-50'></div>
                        <img 
                            src="https://img.freepik.com/free-photo/construction-workers-sunset_53876-138180.jpg" 
                            alt="Blue-collar workers" 
                                className='relative rounded-lg shadow-lg object-cover w-full max-h-[450px] border border-white/20'
                        />
                            <div className='absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20'>
                                <div className='flex items-center gap-2'>
                                    <MapPin className='h-5 w-5 text-warning-300' />
                                    <span className='text-white font-medium'>Find local opportunities in your area</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroSection