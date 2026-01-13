# ⚠️ Backend Setup Required

## Why You're Getting 404 Errors

The 404 errors you're seeing are because:
- ✅ Your **frontend** is deployed on Netlify (working!)
- ❌ Your **backend** (FastAPI) is NOT deployed yet
- The frontend is trying to call API endpoints that don't exist

## Quick Fix: Deploy Your Backend

You have 3 easy options:

### Option 1: Railway (Easiest - Recommended) 🚂

1. Go to https://railway.app
2. Sign up/login (free)
3. Click "New Project"
4. Select "Deploy from GitHub repo" OR "Empty Project"
5. If Empty Project:
   - Add "GitHub Repo" service
   - Select your repo
   - Set Root Directory to: `backend`
   - Railway auto-detects Python and installs dependencies
6. Add environment variable:
   - `DATABASE_URL` = `sqlite:///./youth_sports_budget.db` (or leave default)
7. Railway will give you a URL like: `https://your-app.railway.app`
8. Update Netlify environment variable:
   - Go to Netlify → Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-app.railway.app/api/v1`
9. Redeploy frontend

### Option 2: Render 🎨

1. Go to https://render.com
2. Sign up/login
3. New → Web Service
4. Connect your GitHub repo
5. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Render gives you a URL
7. Update Netlify `VITE_API_URL` environment variable
8. Redeploy frontend

### Option 3: Fly.io 🪰

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. In `backend` folder: `fly launch`
3. Follow prompts
4. Get URL and update Netlify

## After Backend is Deployed

1. **Get your backend URL** (e.g., `https://your-app.railway.app`)
2. **In Netlify:**
   - Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api/v1`
3. **Redeploy** your frontend
4. **Test** - the 404 errors should be gone!

## Temporary Workaround

If you want to test the frontend without a backend:
- The UI will load but show errors when trying to fetch data
- You can still see the interface and navigation
- Data operations won't work until backend is deployed

## Need Help?

The backend code is in the `backend/` folder. It's a standard FastAPI app that any Python hosting service can run.
