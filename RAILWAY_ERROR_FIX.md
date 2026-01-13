# 🚂 Fix Railway Railpack Error - Complete Guide

## The Error: "Railpack process exited with an error"

This means Railway's build system (Nixpacks) can't build your app. Here's how to fix it:

## ✅ Step-by-Step Fix

### 1. Check Railway Service Settings

**In Railway Dashboard → Your Service → Settings:**

**Root Directory:** Must be exactly `backend`

**Start Command:** Must be exactly:
```
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

**Build Command:** Leave EMPTY (Railway auto-detects from requirements.txt)

### 2. Check Railway Logs for Exact Error

1. Railway Dashboard → Your Service
2. Click **"Deployments"** tab
3. Click the **failed deployment** (red one)
4. Click **"View Logs"**
5. **Scroll to the bottom** - the error is usually at the end
6. **Copy the exact error message**

### 3. Common Errors & Fixes

#### Error: "No module named 'app'"
**Cause:** Root Directory not set to `backend`
**Fix:** Set Root Directory = `backend` in Railway settings

#### Error: "uvicorn: command not found"
**Cause:** Using `uvicorn` instead of `python -m uvicorn`
**Fix:** Start Command must be: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### Error: "pip install failed"
**Cause:** requirements.txt issue
**Fix:** I've updated requirements.txt - make sure Railway pulls latest from GitHub

#### Error: "Database initialization failed"
**Cause:** Database init during build
**Fix:** Database now auto-initializes on startup (not during build)

#### Error: "Port already in use"
**Cause:** Not using $PORT variable
**Fix:** Start Command must include `--port $PORT`

### 4. Force Railway to Rebuild

1. Railway Dashboard → Your Service
2. Settings → **Delete the service** (don't worry, you can recreate)
3. **New Service** → Deploy from GitHub
4. Select your repo: `35gcs/youthsportsbudget`
5. **Set Root Directory:** `backend`
6. **Set Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Deploy

### 5. Alternative: Use Railway CLI

If dashboard doesn't work, use Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set variables
railway variables set ROOT_DIRECTORY=backend

# Deploy
railway up
```

## 🔍 What I Just Fixed

✅ Removed database init from build (moved to startup)
✅ Simplified requirements.txt
✅ Added startup.py for auto database init
✅ Updated all config files
✅ Added .python-version for Python detection
✅ Fixed startup script
✅ All pushed to GitHub

## 📋 Railway Settings Checklist

- [ ] **Root Directory:** `backend` (exactly this)
- [ ] **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] **Build Command:** (empty - Railway auto-detects)
- [ ] **Service connected to GitHub:** `35gcs/youthsportsbudget`
- [ ] **Branch:** `main`
- [ ] **Latest code pulled:** (Railway auto-pulls on push)

## 🎯 Expected Logs (When Working)

You should see in Railway logs:
```
Installing dependencies...
✓ pip install -r requirements.txt
Starting application...
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:XXXX
```

## 🆘 Still Not Working?

**Please share:**
1. The **exact error message** from Railway logs (bottom of the log)
2. Your Railway **Root Directory** setting
3. Your Railway **Start Command** setting

With that, I can give you the exact fix!

## 💡 Pro Tip

If Railway keeps failing, try this **minimal start command**:
```
python -c "from app.main import app; import uvicorn; uvicorn.run(app, host='0.0.0.0', port=int('$PORT'))"
```

This bypasses any shell issues.
