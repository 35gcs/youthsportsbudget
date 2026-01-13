# 🚂 Railway Deployment - Quick Fix Guide

## The Error: "Railpack process exited with an error"

This happens when Railway can't figure out how to start your app. I've fixed this!

## ✅ What I Just Fixed

1. ✅ Added `Procfile` - Tells Railway the start command
2. ✅ Added `railway.json` - Railway configuration
3. ✅ Added `nixpacks.toml` - Build configuration
4. ✅ Added `start.sh` - Startup script
5. ✅ Updated CORS settings - Allow all origins
6. ✅ Pushed to GitHub - All fixes are live

## 🔧 Railway Configuration Steps

### In Railway Dashboard:

1. **Go to your service**
2. **Settings → Service Settings**
3. **Set these values:**

   **Root Directory:** `backend`
   
   **Start Command:** 
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
   
   **OR use the startup script:**
   ```
   bash start.sh
   ```

4. **Environment Variables:**
   - `PORT` - Railway sets this automatically (don't add manually)
   - `DATABASE_URL` - Optional (defaults to SQLite)
   - `CORS_ORIGINS` - Optional (comma-separated list of allowed origins)

5. **Redeploy** - Railway should auto-deploy from GitHub, or click "Redeploy"

## 🐛 If Still Getting Errors

### Check Railway Logs:

1. Go to Railway dashboard
2. Click your service
3. Click "Deployments" tab
4. Click the latest deployment
5. View logs - this shows the exact error

### Common Issues:

**"ModuleNotFoundError: No module named 'app'"**
- ✅ Fix: Set Root Directory to `backend` in Railway settings

**"Port already in use"**
- ✅ Fix: Use `$PORT` (Railway sets this automatically)

**"Database error"**
- ✅ Fix: Database will auto-create, or add `DATABASE_URL` environment variable

**"Import errors"**
- ✅ Fix: Make sure Root Directory is `backend` so Python can find the `app` module

## 📋 Quick Checklist

- [ ] Root Directory set to `backend`
- [ ] Start Command set correctly
- [ ] Service is connected to GitHub repo
- [ ] Latest code is pushed to GitHub
- [ ] Check deployment logs for specific errors

## 🎯 Expected Result

After configuration, Railway should:
1. Install dependencies from `requirements.txt`
2. Initialize database (if needed)
3. Start uvicorn server on port $PORT
4. Your API will be live at: `https://your-app.railway.app`

## 🔗 Next Steps

Once Railway is working:
1. Get your Railway URL (e.g., `https://youth-sports-budget.railway.app`)
2. Update Netlify environment variable:
   - `VITE_API_URL` = `https://your-railway-url.railway.app/api/v1`
3. Redeploy Netlify
4. Everything should work! 🎉

## Still Having Issues?

Share the error message from Railway logs and I can help debug!
