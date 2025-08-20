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
import { setLoading, resetLoading } from '@/redux/authSlice'
import { Loader2, Briefcase, PersonStanding, UserPlus, Upload, User, Mail, Phone, Lock, CheckCircle2, Shield } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [fileLabel, setFileLabel] = useState("Upload a profile photo");
    const {loading, user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Reset loading state when component mounts
    useEffect(() => {
        dispatch(resetLoading());
    }, [dispatch]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, file: file });
            setFileLabel(file.name);
        }
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user, navigate])
    
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <Navbar />
            <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 py-6 sm:py-12">
                {/* Left side - hero section */}
                <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-l-2xl flex-col justify-center p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                        <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
                        <div className="absolute bottom-20 right-10 w-60 h-60 rounded-full bg-blue-300"></div>
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 mb-6">
                            <Shield className="h-9 w-9" />
                            <h2 className="text-3xl font-bold">THOZHAN</h2>
                        </div>
                        <h1 className="text-4xl font-bold mb-6">Start your<br />journey with us</h1>
                        <p className="text-blue-100 mb-8">Create your account today and unlock access to blue-collar job opportunities tailored for you.</p>
                        
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/30 p-2 rounded-full">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <p className="font-medium">Quick and easy registration</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/30 p-2 rounded-full">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <p className="font-medium">Free access to job listings</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="bg-blue-500/30 p-2 rounded-full">
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <p className="font-medium">Trusted by thousands of workers</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Right side - form */}
                <div className="w-full md:w-7/12 bg-white p-6 sm:p-10 md:rounded-r-2xl shadow-xl">
                    <div className="max-w-lg mx-auto">
                        <div className="mb-6 md:hidden text-center">
                            <h1 className="text-2xl font-bold text-blue-700">THOZHAN</h1>
                            <p className="text-gray-600 text-sm">Your blue-collar job portal</p>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Create Your Account</h2>
                            <p className="text-gray-500 mt-1">Join THOZHAN to connect with opportunities</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className="space-y-5">
                            <div>
                                <Label htmlFor="fullname" className="text-gray-700 font-medium text-sm">Full Name</Label>
                                <div className="mt-1.5 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        value={input.fullname}
                                        name="fullname"
                                        onChange={changeEventHandler}
                                        placeholder="Enter your full name"
                                        className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 h-11"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <Label htmlFor="email" className="text-gray-700 font-medium text-sm">Email Address</Label>
                                    <div className="mt-1.5 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={input.email}
                                            name="email"
                                            onChange={changeEventHandler}
                                            placeholder="you@example.com"
                                            className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 h-11"
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <Label htmlFor="phoneNumber" className="text-gray-700 font-medium text-sm">Phone Number</Label>
                                    <div className="mt-1.5 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="phoneNumber"
                                            type="text"
                                            value={input.phoneNumber}
                                            name="phoneNumber"
                                            onChange={changeEventHandler}
                                            placeholder="Enter your phone number"
                                            className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 h-11"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="password" className="text-gray-700 font-medium text-sm">Password</Label>
                                <div className="mt-1.5 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="Create a secure password"
                                        className="pl-10 w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 h-11"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
                            </div>
                            
                            <div className="pt-1">
                                <Label className="text-gray-700 font-medium block mb-3 text-sm">I am a:</Label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div 
                                        className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all ${
                                            input.role === 'worker' 
                                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                        }`}
                                        onClick={() => setInput({ ...input, role: 'worker' })}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value="worker"
                                            checked={input.role === 'worker'}
                                            onChange={changeEventHandler}
                                            className="cursor-pointer"
                                            id="worker-role"
                                            required
                                        />
                                        <label htmlFor="worker-role" className="ml-2.5 flex items-center cursor-pointer w-full">
                                            <PersonStanding className="h-5 w-5 mr-2 text-blue-600" />
                                            <span className="font-medium text-sm">Worker</span>
                                        </label>
                                    </div>
                                    <div 
                                        className={`flex items-center p-3.5 border rounded-lg cursor-pointer transition-all ${
                                            input.role === 'employer' 
                                            ? 'border-blue-500 bg-blue-50 shadow-sm' 
                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                        }`}
                                        onClick={() => setInput({ ...input, role: 'employer' })}
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
                                            <span className="font-medium text-sm">Employer</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="profile-photo" className="text-gray-700 font-medium text-sm">Profile Photo</Label>
                                <div className="mt-1.5 relative border border-dashed border-gray-300 rounded-lg p-3 flex items-center cursor-pointer hover:bg-blue-50/30 transition-colors" onClick={() => document.getElementById('profile-photo').click()}>
                                    <div className="mr-3 bg-blue-100 p-2 rounded-full flex-shrink-0">
                                        <Upload className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="flex-grow overflow-hidden">
                                        <p className="text-sm text-gray-600 truncate">{fileLabel}</p>
                                        <p className="text-xs text-gray-500">JPG, JPEG or PNG (max 2MB)</p>
                                    </div>
                                    <Input
                                        id="profile-photo"
                                        accept="image/*"
                                        type="file"
                                        onChange={changeFileHandler}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                            
                            {loading ? (
                                <Button disabled className="w-full mt-3 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md h-11"> 
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Please wait 
                                </Button>
                            ) : (
                                <Button 
                                    type="submit" 
                                    className="w-full mt-3 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center h-11"
                                >
                                    <UserPlus className="h-5 w-5 mr-2" /> Create Account
                                </Button>
                            )}

                            <div className="relative flex items-center justify-center py-2">
                                <div className="h-px bg-gray-200 w-full"></div>
                                <div className="absolute bg-white px-3 text-sm text-gray-500">or</div>
                            </div>
                            
                            <div className="text-center">
                                <span className="text-gray-600 text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
                                        Sign in
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

export default Signup