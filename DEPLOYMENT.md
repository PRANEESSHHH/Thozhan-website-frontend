# Thozhan Job Portal - Frontend Deployment Guide

## 🚀 Vercel Deployment

### Prerequisites
- Node.js 18+ installed
- Vercel account
- Backend API deployed and accessible

### Environment Variables
Before deploying, set up the following environment variable in Vercel:

```
VITE_API_BASE_URL=https://your-backend-api-url.com
```

### Deployment Steps

#### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Option 2: Deploy via Vercel Dashboard
1. Connect your GitHub repository to Vercel
2. Set the environment variable `VITE_API_BASE_URL`
3. Deploy automatically on push to main branch

### Build Configuration
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Performance Optimizations
- ✅ Code splitting implemented
- ✅ Vendor chunks separated for better caching
- ✅ Console logs removed in production
- ✅ Terser minification enabled
- ✅ Static assets cached for 1 year

### Environment Variables Explained
- `VITE_API_BASE_URL`: The base URL of your backend API
  - Development: `http://localhost:3000`
  - Production: `https://your-backend-domain.com`

### Troubleshooting
1. **Build fails**: Check that all dependencies are installed
2. **API calls fail**: Verify `VITE_API_BASE_URL` is set correctly
3. **Routing issues**: The `vercel.json` handles SPA routing automatically

### Local Development
1. Copy `.env.example` to `.env`
2. Update `VITE_API_BASE_URL` if needed
3. Run `npm run dev`

### Production Testing
1. Build locally: `npm run build`
2. Preview: `npm run preview`
3. Test all functionality before deploying
