# Deployment Guide for Netlify Drop

## Frontend Deployment (Netlify Drop)

### Option 1: Drag and Drop (Easiest)

1. **Build the frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Drag and Drop:**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag the `frontend/dist` folder onto the page
   - Your site will be live in seconds!

### Option 2: Using Netlify.toml

1. The `netlify.toml` file is already configured
2. Connect your GitHub repo to Netlify, or
3. Use Netlify CLI: `netlify deploy --prod`

## Backend Deployment

**Important:** Netlify Drop is for static sites only. Your FastAPI backend needs to be deployed separately.

### Recommended Backend Hosting Options:

1. **Railway** (Easiest)
   - Go to [railway.app](https://railway.app)
   - New Project → Deploy from GitHub
   - Select your repo, set root directory to `backend`
   - Add environment variables if needed
   - Railway will auto-detect Python and install dependencies

2. **Render**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect your repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Fly.io**
   - Install Fly CLI
   - `fly launch` in the backend directory
   - Follow prompts

### After Backend is Deployed:

1. Update the frontend environment variable:
   - In `frontend/.env.production` or Netlify environment variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api/v1
   ```

2. Rebuild and redeploy the frontend

## Environment Variables

### Frontend (.env or Netlify Environment Variables):
```
VITE_API_URL=https://your-backend-url.com/api/v1
```

### Backend (Railway/Render/etc):
```
DATABASE_URL=sqlite:///./youth_sports_budget.db
# Or use PostgreSQL for production:
# DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

## Quick Start for Netlify Drop

1. Build frontend: `cd frontend && npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag `frontend/dist` folder
4. Done! Your frontend is live.

**Note:** You'll still need to deploy the backend separately for the app to work fully.
