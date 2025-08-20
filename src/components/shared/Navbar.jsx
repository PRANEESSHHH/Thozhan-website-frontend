import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { 
    LogOut, 
    User2, 
    Hammer, 
    Building2, 
    Settings, 
    Bookmark, 
    FileText, 
    Menu, 
    X, 
    Home, 
    Briefcase, 
    Users,
    PlusCircle,
    BarChart3,
    MapPin,
    Search,
    Bell
} from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '@/utils/axios'
import { setUser, logout } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logoutHandler = async () => {
        try {
            // First try to call the logout endpoint
            await axiosInstance.get('/user/logout',{withCredentials:true});
        } catch (error) {
            console.log('Logout request failed:', error);
        } finally {
            // Always clear local state regardless of server response
            localStorage.clear();
            dispatch(logout());
            navigate("/");
            toast.success("Logged out successfully");
        }
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }
    
    const isActive = (path) => {
        return location.pathname === path ? 'text-primary-600 font-medium' : 'text-gray-700';
    }
    
    return (
        <div className='bg-white shadow-soft sticky top-0 z-50'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                {/* Logo */}
                <Link to="/" className='flex items-center gap-2 hover:opacity-90 transition-opacity'>
                    <div className='gradient-bg h-10 w-10 rounded-lg flex items-center justify-center shadow-md'>
                        <Hammer className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                        <h1 className='text-2xl font-bold text-gray-900 leading-none font-display'>
                            THOZHAN
                        </h1>
                        <span className='text-[10px] text-primary-600 font-medium tracking-wider -mt-1'>BLUE COLLAR JOB PORTAL</span>
                    </div>
                </Link>
                
                <div className='flex items-center gap-4 md:gap-8'>
                    {/* Desktop Navigation */}
                    <ul className='hidden md:flex font-medium items-center gap-6'>
                        {/* Always show Home button */}
                        <li>
                            <Link 
                                to="/" 
                                className={`${isActive('/')} hover:text-primary-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50`}
                            >
                                <Home className="h-4 w-4" />
                                <span>Home</span>
                            </Link>
                        </li>
                        
                        {/* Role-specific navigation */}
                        {
                            user && user.role === 'employer' ? (
                                <>
                                    <li>
                                        <Link 
                                            to="/admin/dashboard" 
                                            className={`${isActive('/admin/dashboard')} hover:text-primary-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50`}
                                        >
                                            <BarChart3 className="h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to="/admin/applications" 
                                            className={`${isActive('/admin/applications')} hover:text-primary-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50`}
                                        >
                                            <FileText className="h-4 w-4" />
                                            <span>Applications</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            to="/admin/jobs/create" 
                                            className={`${isActive('/admin/jobs/create')} hover:text-primary-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50`}
                                        >
                                            <PlusCircle className="h-4 w-4" />
                                            <span>Post Job</span>
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link 
                                            to="/jobs" 
                                            className={`${isActive('/jobs')} hover:text-primary-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50`}
                                        >
                                            <Search className="h-4 w-4" />
                                            <span>Find Jobs</span>
                                        </Link>
                                    </li>
                                    {user && (
                                        <li>
                                            <Link 
                                                to="/profile" 
                                                className={`${isActive('/profile')} hover:text-primary-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50`}
                                            >
                                                <User2 className="h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </li>
                                    )}
                                </>
                            )
                        }
                    </ul>
                    
                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none hover:bg-gray-100 transition-colors" 
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? 
                            <X className="h-6 w-6 text-gray-700" /> : 
                            <Menu className="h-6 w-6 text-gray-700" />
                        }
                    </button>
                    
                    {/* User Actions */}
                    {
                        !user ? (
                            <div className='flex items-center gap-2'>
                                <Link to="/login">
                                    <Button variant="outline" className="border-gray-300 hover:border-primary-300 hover:bg-primary-50 flex items-center gap-2">
                                        <User2 className="h-4 w-4" />
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button className="gradient-bg hover:bg-primary-700 flex items-center gap-2">
                                        <PlusCircle className="h-4 w-4" />
                                        Signup
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* Notification Bell (placeholder for future feature) */}
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="relative hover:bg-gray-100 p-2"
                                    title="Notifications"
                                >
                                    <Bell className="h-5 w-5 text-gray-600" />
                                    {/* Notification dot - can be conditionally shown */}
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center opacity-0">
                                        
                                    </span>
                                </Button>
                                
                                {/* User Avatar Dropdown */}
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Avatar className="cursor-pointer border-2 border-primary-100 shadow-sm hover:border-primary-200 transition-colors">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        </Avatar>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80 shadow-card p-0 overflow-hidden border border-gray-100">
                                        <div className=''>
                                            <div className='flex gap-3 items-start p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-gray-100'>
                                                <Avatar className="cursor-pointer h-12 w-12 border-2 border-white shadow-sm">
                                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                                </Avatar>
                                                <div>
                                                    <h4 className='font-medium text-gray-900'>{user?.fullname}</h4>
                                                    <p className='text-sm text-gray-500'>{user?.email}</p>
                                                    <span className='inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 text-xs rounded-full'>
                                                        {user?.role === 'worker' ? 'Worker' : 'Employer'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='flex flex-col p-2 space-y-1'>
                                                {
                                                    user && user.role === 'worker' && (
                                                        <>
                                                            <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                                <User2 className="h-4 w-4 text-primary-600" />
                                                                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline">
                                                                    <Link to="/profile">My Profile</Link>
                                                                </Button>
                                                            </div>
                                                            
                                                            <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                                <Bookmark className="h-4 w-4 text-primary-600" />
                                                                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline">
                                                                    <Link to="/jobs?saved=true">Saved Jobs</Link>
                                                                </Button>
                                                            </div>
                                                            
                                                            <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                                <FileText className="h-4 w-4 text-primary-600" />
                                                                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline">
                                                                    <Link to="/my-applications">My Applications</Link>
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                
                                                {
                                                    user && user.role === 'employer' && (
                                                        <>
                                                            <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                                <BarChart3 className="h-4 w-4 text-primary-600" />
                                                                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline">
                                                                    <Link to="/admin/dashboard">Dashboard</Link>
                                                                </Button>
                                                            </div>
                                                            
                                                            <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                                <FileText className="h-4 w-4 text-primary-600" />
                                                                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline">
                                                                    <Link to="/admin/applications">Applications</Link>
                                                                </Button>
                                                            </div>
                                                            
                                                            <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                                <Briefcase className="h-4 w-4 text-primary-600" />
                                                                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline">
                                                                    <Link to="/admin/jobs">My Job Posts</Link>
                                                                </Button>
                                                            </div>
                                                            
                                                            <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                                <PlusCircle className="h-4 w-4 text-primary-600" />
                                                                <Button variant="link" className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline">
                                                                    <Link to="/admin/jobs/create">Post New Job</Link>
                                                                </Button>
                                                            </div>
                                                        </>
                                                    )
                                                }
                                                
                                                <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md transition-colors'>
                                                    <Settings className="h-4 w-4 text-primary-600" />
                                                    <Button 
                                                        variant="link" 
                                                        className="p-0 h-auto text-gray-700 hover:text-primary-600 hover:no-underline"
                                                        onClick={() => navigate('/profile?settings=true')}
                                                    >
                                                        Account Settings
                                                    </Button>
                                                </div>

                                                <div className='flex w-full items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-md border-t mt-2 pt-3 transition-colors'>
                                                    <LogOut className="h-4 w-4 text-red-500" />
                                                    <Button onClick={logoutHandler} variant="link" className="p-0 h-auto text-gray-700 hover:text-red-500 hover:no-underline">Logout</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        )
                    }
                </div>
            </div>
            
            {/* Enhanced Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-md">
                    <div className="px-4 py-3 space-y-2">
                        {/* Always show Home in mobile */}
                        <Link 
                            to="/" 
                            className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/')} hover:text-primary-600 hover:bg-primary-50 transition-all`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Home className="h-5 w-5" />
                            <span className="font-medium">Home</span>
                        </Link>
                        
                        {user && user.role === 'employer' ? (
                            <>
                                <Link 
                                    to="/admin/dashboard" 
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/admin/dashboard')} hover:text-primary-600 hover:bg-primary-50 transition-all`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <BarChart3 className="h-5 w-5" />
                                    <span className="font-medium">Dashboard</span>
                                </Link>
                                <Link 
                                    to="/admin/applications" 
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/admin/applications')} hover:text-primary-600 hover:bg-primary-50 transition-all`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <FileText className="h-5 w-5" />
                                    <span className="font-medium">Applications</span>
                                </Link>
                                <Link 
                                    to="/admin/jobs/create" 
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/admin/jobs/create')} hover:text-primary-600 hover:bg-primary-50 transition-all`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    <span className="font-medium">Post Job</span>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/jobs" 
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/jobs')} hover:text-primary-600 hover:bg-primary-50 transition-all`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Search className="h-5 w-5" />
                                    <span className="font-medium">Find Jobs</span>
                                </Link>
                            </>
                        )}
                        
                        {/* User-specific mobile menu items */}
                        {user && user.role === 'worker' && (
                            <>
                                <Link 
                                    to="/profile" 
                                    className={`flex items-center space-x-3 p-3 rounded-lg ${isActive('/profile')} hover:text-primary-600 hover:bg-primary-50 transition-all`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User2 className="h-5 w-5" />
                                    <span className="font-medium">My Profile</span>
                                </Link>
                                <Link 
                                    to="/jobs?saved=true" 
                                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Bookmark className="h-5 w-5" />
                                    <span className="font-medium">Saved Jobs</span>
                                </Link>
                            </>
                        )}
                        
                        {/* Login/Signup for non-authenticated users */}
                        {!user && (
                            <div className="border-t pt-3 mt-3 space-y-2">
                                <Link 
                                    to="/login" 
                                    className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User2 className="h-5 w-5" />
                                    <span className="font-medium">Login</span>
                                </Link>
                                <Link 
                                    to="/signup" 
                                    className="flex items-center space-x-3 p-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-all"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <PlusCircle className="h-5 w-5" />
                                    <span className="font-medium">Sign Up</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar