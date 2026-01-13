# 🔧 Fix "Railpack could not determine how to build the app"

## The Problem

Railway's Nixpacks (Railpack) can't detect your Python app. This happens when:
- Railway can't find `requirements.txt` in the root directory
- Python version isn't detected
- Build configuration is missing

## ✅ The Fix - 3 Steps

### Step 1: Verify Railway Settings

**In Railway Dashboard → Your Service → Settings:**

1. **Root Directory:** Must be `backend` (exactly this)
2. **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. **Build Command:** (Leave empty OR use: `pip install -r requirements.txt`)

### Step 2: Force Railway to Use Nixpacks

If Railway still can't detect, manually set the builder:

1. Railway Dashboard → Your Service → Settings
2. Look for **"Builder"** or **"Build System"**
3. Select: **"Nixpacks"** (not Docker, not Custom)

### Step 3: Alternative - Use Dockerfile

If Nixpacks still fails, Railway can use Docker:

1. Railway Dashboard → Your Service → Settings
2. **Builder:** Select **"Dockerfile"**
3. Railway will use the `Dockerfile` I just added

## 🔍 What I Just Added

✅ `setup.py` - Python package detection
✅ `pyproject.toml` - Modern Python project config
✅ `.python-version` - Python version (3.9)
✅ `build.sh` - Build script
✅ `Dockerfile` - Alternative deployment method
✅ Updated `nixpacks.toml` - Better build config
✅ All pushed to GitHub

## 📋 Quick Checklist

- [ ] Root Directory = `backend`
- [ ] Start Command = `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Builder = Nixpacks (or Dockerfile)
- [ ] requirements.txt exists in backend/
- [ ] .python-version exists in backend/

## 🆘 Still Getting "Could not determine how to build"?

**Try this:**

1. **Delete** your Railway service
2. **New Service** → Deploy from GitHub
3. Select: `35gcs/youthsportsbudget`
4. **Root Directory:** `backend`
5. **Builder:** Select **"Dockerfile"** (instead of Nixpacks)
6. **Start Command:** `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
7. Deploy

Dockerfile is more reliable than Nixpacks auto-detection.

## ✅ Expected Result

After fix, Railway logs should show:
```
Detected Python project
Installing dependencies...
✓ pip install -r requirements.txt
Starting application...
✓ Application startup complete
```

Your API will be live at: `https://your-app.railway.app`
