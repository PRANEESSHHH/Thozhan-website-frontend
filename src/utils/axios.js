import axios from 'axios';

// Use environment variable for API base URL, fallback to Render backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://thozhan-website-backend.onrender.com";

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true  // Enable sending cookies with cross-origin requests
});

// Add a request interceptor to handle token refresh
axiosInstance.interceptors.request.use(
    (config) => {
        // Ensure the URL starts with a forward slash
        if (config.url && !config.url.startsWith('/')) {
            config.url = '/' + config.url;
        }

        // Add Authorization header if token exists in localStorage (for cross-origin requests)
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Only redirect to login if we're not already on the home page or auth pages
            const currentPath = window.location.pathname;
            const isAuthPage = ['/login', '/signup'].includes(currentPath);
            const isHomePage = currentPath === '/';
            
            // Clear local storage but don't automatically redirect from home page
            localStorage.clear();
            
            // Only redirect if user is trying to access protected routes
            if (!isAuthPage && !isHomePage) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance; 