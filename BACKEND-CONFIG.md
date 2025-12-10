# 🔗 Backend Configuration

## Production Backend URL
**Render Deployment**: `https://thozhan-website-backend.onrender.com`

## Configuration Files Updated:

### 1. `.env` (Local Development)
```
VITE_API_BASE_URL=https://thozhan-website-backend.onrender.com
```

### 2. Vercel Environment Variables
Set this in your Vercel dashboard:
```
VITE_API_BASE_URL=https://thozhan-website-backend.onrender.com
```

## API Endpoints
With this configuration, your frontend will connect to:
- **User API**: `https://thozhan-website-backend.onrender.com/api/v1/user`
- **Job API**: `https://thozhan-website-backend.onrender.com/api/v1/job`
- **Company API**: `https://thozhan-website-backend.onrender.com/api/v1/company`
- **Application API**: `https://thozhan-website-backend.onrender.com/api/v1/application`

## Local Development
To switch back to local development, update `.env`:
```
VITE_API_BASE_URL=http://localhost:3000
```

## CORS Configuration
Make sure your backend on Render allows requests from:
- Your Vercel domain (e.g., `https://your-app.vercel.app`)
- Local development (`http://localhost:5173`)

---
**Backend URL successfully configured!** ✅
