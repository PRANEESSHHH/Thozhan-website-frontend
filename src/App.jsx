import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setUser } from './redux/authSlice'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Home from './components/Home'
import Browse from './components/Browse'
import Profile from './components/Profile'
import JobDescription from './components/JobDescription'
import Companies from './components/admin/Companies'
import CompanyDashboard from './components/admin/CompanyDashboard'
import CompanyCreate from './components/admin/CompanyCreate'
import CompanySetup from './components/admin/CompanySetup'
import AdminJobs from "./components/admin/AdminJobs";
import AllEmployersJobs from "./components/admin/AllEmployersJobs";
import PostJob from './components/admin/PostJob'
import Applicants from './components/admin/Applicants'
import Applications from './components/admin/Applications'
import MyApplications from './components/MyApplications'
import ProtectedRoute from './components/admin/ProtectedRoute'
import LoadingScreen from './components/LoadingScreen'
import axiosInstance from './utils/axios'

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: "/jobs",
    element: <Browse />
  },
  {
    path: "/description/:id",
    element: <JobDescription />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/my-applications",
    element: <ProtectedRoute><MyApplications /></ProtectedRoute>
  },
  // admin ke liye yha se start hoga
  {
    path:"/admin/dashboard",
    element: <ProtectedRoute><CompanyDashboard /></ProtectedRoute>
  },
  {
    path:"/admin/companies",
    element: <ProtectedRoute><Companies/></ProtectedRoute>
  },
  {
    path:"/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate/></ProtectedRoute> 
  },
  {
    path:"/admin/companies/:id",
    element:<ProtectedRoute><CompanySetup/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs",
    element:<ProtectedRoute><AdminJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/all-employers-jobs",
    element:<ProtectedRoute><AllEmployersJobs/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/create",
    element:<ProtectedRoute><PostJob/></ProtectedRoute> 
  },
  {
    path:"/admin/jobs/:id/applicants",
    element:<ProtectedRoute><Applicants/></ProtectedRoute> 
  },
  {
    path:"/admin/applications",
    element:<ProtectedRoute><Applications/></ProtectedRoute> 
  }
], {
  future: {
    v7_startTransition: true
  }
})

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication on app load
    const checkAuthStatus = async () => {
      try {
        const res = await axiosInstance.get('/user/profile');
        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        // User is not authenticated, that's okay
        console.log('User not authenticated');
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  useEffect(() => {
    // Show loading screen for 3 seconds on initial app load
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading screen on initial app startup
  if (isInitialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  )
}

export default App
