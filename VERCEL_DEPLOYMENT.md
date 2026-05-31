# Vercel Deployment Guide

## Prerequisites
- GitHub account with this repository pushed
- Vercel account (create at https://vercel.com)
- Backend deployed separately (on Railway, Render, AWS, etc.)

## Step 1: Push to GitHub

Make sure all changes are committed and pushed:
```bash
git add .
git commit -m "Setup Vercel deployment"
git push origin main
```

## Step 2: Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Continue with GitHub"
3. Select your repository
4. In the **Configure Project** section:
   - **Framework Preset**: Select "Vite"
   - **Root Directory**: Set to `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

## Step 3: Set Environment Variables

Before deploying, add environment variables:

1. In the Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add the following:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com
   ```
   Replace `your-backend-url.com` with your actual backend domain

   **Examples:**
   - If using Railway: `https://your-railway-app.up.railway.app`
   - If using Render: `https://your-render-service.onrender.com`
   - If using AWS: `https://api.yourdomain.com`

3. Click "Save"

## Step 4: Deploy

1. Click the **Deploy** button
2. Vercel will build and deploy your frontend automatically
3. Your app will be available at: `https://[project-name].vercel.app`

## Step 5: Configure Backend Deployment

Your FastAPI backend is NOT supported on Vercel directly (Python runtime).

### Recommended Backend Hosting Options:

#### Option 1: Railway (Recommended - Simple)
1. Go to https://railway.app
2. Connect GitHub
3. Select your repository
4. Railway will auto-detect the Python app
5. Set environment variables in Railway dashboard
6. Get your deployed URL

#### Option 2: Render
1. Go to https://render.com
2. Click "New+" → "Web Service"
3. Connect GitHub
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 8000`

#### Option 3: AWS EC2 / Lightsail
- Deploy using Docker (Dockerfile provided)
- More control but requires more configuration

## Step 6: Update Frontend with Backend URL

After deploying your backend:

1. In Vercel Dashboard → Settings → Environment Variables
2. Update `VITE_API_BASE_URL` with your backend URL
3. Vercel will automatically redeploy

## Troubleshooting

### CORS Issues
If you get CORS errors, update your FastAPI backend:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### File Uploads Not Working
Ensure your backend handles uploads from the frontend's new domain.

### API Calls Failing
1. Check the browser console for errors
2. Verify `VITE_API_BASE_URL` is set correctly
3. Check your backend logs

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `https://api.example.com` |

## Redeployment

To redeploy after making changes:
1. Push changes to GitHub
2. Vercel automatically redeploys (if connected)

Or manually trigger:
1. Go to Vercel Dashboard
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment

## Custom Domain

To add a custom domain:
1. In Vercel Dashboard → Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions
4. Update backend CORS if needed
