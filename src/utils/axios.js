import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add a request interceptor to handle token refresh
axiosInstance.interceptors.request.use(
    (config) => {
        // Ensure the URL starts with a forward slash
        if (config.url && !config.url.startsWith('/')) {
            config.url = '/' + config.url;
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