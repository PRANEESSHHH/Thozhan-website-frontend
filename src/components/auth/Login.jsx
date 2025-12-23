import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser, resetLoading } from '@/redux/authSlice'
import { Loader2, Briefcase, PersonStanding, LogIn, Shield, CheckCircle2, User, AlertCircle } from 'lucide-react'
import LoadingScreen from '../LoadingScreen'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [showLoadingScreen, setShowLoadingScreen] = useState(false);
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Reset loading state when component mounts
    useEffect(() => {
        dispatch(resetLoading());
    }, [dispatch]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        
        // Clear errors when user changes input
        if (formErrors[e.target.name]) {
            setFormErrors({
                ...formErrors,
                [e.target.name]: null
            });
        }
    }

    const validateForm = () => {
        const errors = {};
        
        // Email validation
        if (!input.email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(input.email)) {
            errors.email = "Please enter a valid email address";
        }
        
        // Password validation
        if (!input.password.trim()) {
            errors.password = "Password is required";
        } else if (input.password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }
        
        // Role validation
        if (!input.role) {
            errors.role = "Please select whether you are a Worker or Employer";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validate form before submission
        if (!validateForm()) {
            toast.error("Please correct the errors before submitting");
            return;
        }
        
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },withCredentials:true
            });
            if (res.data.success) {
                console.log("Login successful, stopping form loading");
                dispatch(setLoading(false)); // Stop the form loading first
                dispatch(setUser({ user: res.data.user, token: res.data.token }));
                toast.success(res.data.message);
                
                console.log("Setting showLoadingScreen to true");
                // Show loading screen for 2.5 seconds before navigating
                setShowLoadingScreen(true);
                
                setTimeout(() => {
                    console.log("Timeout completed, navigating to home");
                    navigate("/");
                }, 2500);
            }
        } catch (error) {
            console.log(error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
                
                // Handle specific backend validation errors
                if (error.response.status === 400 && error.response.data.errors) {
                    setFormErrors(error.response.data.errors);
                }
            } else {
                toast.error("An error occurred during login. Please try again.");
            }
            dispatch(setLoading(false));
        }
    }
    
    useEffect(() => {
        console.log("useEffect called - user:", !!user, "showLoadingScreen:", showLoadingScreen);
        // Only auto-navigate if user exists and we're not in the middle of a login flow
        if (user && !showLoadingScreen) {
            console.log("Auto-navigating to home");
            navigate("/");
        }
    }, [user, navigate, showLoadingScreen]);

    // Show loading screen if user just logged in
    if (showLoadingScreen) {
        console.log("Rendering LoadingScreen");
        return <LoadingScreen type="login" />;
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Navbar />
            <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-6 sm:py-12">
                {/* Left side - hero section */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-l-2xl flex-col justify-center p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
                        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-300"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-6">
                            <Shield className="h-9 w-9" />
                            <h2 className="text-3xl font-bold">THOZHAN</h2>
                        </div>
                        <h1 className="text-4xl font-bold mb-6">Sign in to<br />your account</h1>
                        <p className="text-blue-100 mb-8">Connect with top employers and find your next blue-collar opportunity with THOZHAN.</p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/30 p-2 rounded-full">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <p className="font-medium">Access to thousands of job listings</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/30 p-2 rounded-full">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <p className="font-medium">Direct connection with employers</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/30 p-2 rounded-full">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <p className="font-medium">Profile builder to showcase your skills</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right side - form */}
                <div className="w-full md:w-1/2 bg-white p-6 sm:p-10 md:rounded-r-2xl shadow-xl">
                    <div className="max-w-md mx-auto">
                        <div className="mb-6 md:hidden text-center">
                            <h1 className="text-2xl font-bold text-blue-700">THOZHAN</h1>
                            <p className="text-gray-600 text-sm">Your blue-collar job portal</p>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
                            <p className="text-gray-500 mt-1">Sign in to access your account</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="text-gray-700 font-medium text-sm sm:text-base">
                                    Email Address
                                </Label>
                                <div className="mt-1.5 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        placeholder="you@example.com"
                                        className={`pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 h-11 ${formErrors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {formErrors.email && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" /> {formErrors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-gray-700 font-medium text-sm sm:text-base">
                                        Password
                                    </Label>
                                    <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                                        Forgot password?
                                    </span>
                                </div>
                                <div className="mt-1.5 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your password"
                                        className={`pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 h-11 ${formErrors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}`}
                                        required
                                    />
                                </div>
                                {formErrors.password && (
                                    <p className="mt-1 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" /> {formErrors.password}
                                    </p>
                                )}
                            </div>
                            
                            <div className="pt-2">
                                <Label className="text-gray-700 font-medium block mb-3 text-sm sm:text-base">I am a:</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div 
                                        className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all ${
                                            input.role === 'worker' 
                                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                            : formErrors.role 
                                              ? 'border-red-300 hover:border-red-400 hover:bg-red-50/50'
                                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                        }`}
                                        onClick={() => {
                                            setInput({ ...input, role: 'worker' });
                                            setFormErrors({ ...formErrors, role: null });
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="worker"
                                            checked={input.role === 'worker'}
                                            onChange={changeEventHandler}
                                            className="cursor-pointer"
                                            id="worker-role"
                                        />
                                        <label htmlFor="worker-role" className="ml-2.5 flex items-center cursor-pointer w-full">
                                            <PersonStanding className="h-5 w-5 mr-2 text-blue-600" />
                                            <span className="font-medium text-sm sm:text-base">Worker</span>
                                        </label>
                                    </div>
                                    <div 
                                        className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all ${
                                            input.role === 'employer' 
                                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                            : formErrors.role 
                                              ? 'border-red-300 hover:border-red-400 hover:bg-red-50/50'
                                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                        }`}
                                        onClick={() => {
                                            setInput({ ...input, role: 'employer' });
                                            setFormErrors({ ...formErrors, role: null });
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="employer"
                                            checked={input.role === 'employer'}
                                            onChange={changeEventHandler}
                                            className="cursor-pointer"
                                            id="employer-role"
                                        />
                                        <label htmlFor="employer-role" className="ml-2.5 flex items-center cursor-pointer w-full">
                                            <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                                            <span className="font-medium text-sm sm:text-base">Employer</span>
                                        </label>
                                    </div>
                                </div>
                                {formErrors.role && (
                                    <p className="mt-2 text-sm text-red-500 flex items-center">
                                        <AlertCircle className="h-4 w-4 mr-1" /> {formErrors.role}
                                    </p>
                                )}
                            </div>
                            
                            {loading ? (
                                <Button disabled className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md h-11"> 
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Please wait 
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center h-11"
                                >
                                    <LogIn className="h-5 w-5 mr-2" /> Sign In
                                </Button>
                            )}
                            
                            <div className="relative flex items-center justify-center py-2">
                                <div className="h-px bg-gray-200 w-full"></div>
                                <div className="absolute bg-white px-3 text-sm text-gray-500">or</div>
                            </div>
                            
                            <div className="text-center">
                                <span className="text-gray-600 text-sm sm:text-base">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                        Sign up now
                                    </Link>
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="text-center mt-6 mb-8 text-xs sm:text-sm text-gray-500">
                <p>THOZHAN - Connecting blue-collar workers with opportunities</p>
            </div>
        </div>
    )
}

export default Login