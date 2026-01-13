# 🚀 Quick Deploy to Netlify Drop

## Step 1: Build the Frontend

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder with all the production files.

## Step 2: Deploy to Netlify Drop

1. Go to: https://app.netlify.com/drop
2. Drag the `frontend/dist` folder onto the page
3. Your site will be live in seconds! 🎉

## Important Notes

### ⚠️ Backend Required

Netlify Drop only hosts the **frontend** (static files). Your FastAPI backend needs to be deployed separately.

**Quick Backend Options:**
- **Railway**: https://railway.app (easiest, auto-detects Python)
- **Render**: https://render.com (free tier available)
- **Fly.io**: https://fly.io (great for Python apps)

### After Backend is Deployed:

1. Get your backend URL (e.g., `https://your-app.railway.app`)
2. Update frontend environment:
   - In Netlify: Site Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api/v1`
3. Redeploy frontend

### Current Setup

- Frontend: React + Vite (ready for Netlify Drop)
- Backend: FastAPI + Python (needs separate hosting)
- Database: SQLite (works for development, consider PostgreSQL for production)

## File Structure for Netlify Drop

```
frontend/dist/          ← Drag this folder to Netlify Drop
  ├── index.html
  ├── assets/
  └── ...
```

That's it! The `frontend/dist` folder contains everything Netlify Drop needs.
