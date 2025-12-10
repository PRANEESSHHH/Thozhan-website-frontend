// Quick test to check environment variables
console.log('Environment Variables Test:');
console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('All env vars:', import.meta.env);

// Test the constants
import { JOB_API_END_POINT } from './src/utils/constant.js';
console.log('JOB_API_END_POINT:', JOB_API_END_POINT);
