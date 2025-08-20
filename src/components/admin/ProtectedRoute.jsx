import React from 'react'
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    const {user} = useSelector(store=>store.auth);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthorization = () => {
            // Only proceed if we have user data (null = not logged in, undefined = still loading)
            if (user === undefined) {
                return;
            }

            // User is not logged in
            if (user === null) {
                navigate("/login");
                return;
            }
            
            // Check if user is employer/recruiter
            if (user.role !== 'employer' && user.role !== 'recruiter') {
                navigate("/");
                return;
            }
            
            // User is authorized
            setIsAuthorized(true);
        };

        checkAuthorization();
        setIsLoading(false);
    }, [user, navigate]);

    // Show loading indicator while checking authorization
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Show loading indicator while waiting for authorization
    if (!isAuthorized && user !== null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // User is authorized, render children
    return isAuthorized ? children : null;
};

export default ProtectedRoute;