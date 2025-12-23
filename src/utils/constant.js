// Use environment variable for API base URL, fallback to Render backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://thozhan-website-backend.onrender.com";

// For production deployment, use the production backend
if (import.meta.env.PROD) {
    // In production, always use the production backend URL
    // This ensures deployed frontend uses deployed backend
}

// Debug logging (remove after testing)
console.log('🔍 Environment Debug:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('API_BASE_URL:', API_BASE_URL);

export const USER_API_END_POINT = `${API_BASE_URL}/api/v1/user`;
export const JOB_API_END_POINT = `${API_BASE_URL}/api/v1/job`;
export const APPLICATION_API_END_POINT = `${API_BASE_URL}/api/v1/application`;
export const COMPANY_API_END_POINT = `${API_BASE_URL}/api/v1/company`;