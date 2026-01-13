# 🚂 Railway Deployment - Exact Steps to Fix

## The Problem
Railway can't start your app because it doesn't know:
1. Where your code is (Root Directory)
2. How to start it (Start Command)

## ✅ EXACT Steps in Railway Dashboard

### Step 1: Go to Your Service
1. Open Railway dashboard
2. Click on your service (the one that's failing)

### Step 2: Open Settings
1. Click **"Settings"** tab (top of the page)
2. Scroll down to **"Service Settings"**

### Step 3: Set Root Directory
1. Find **"Root Directory"** field
2. Type exactly: `backend`
3. (NOT `/backend`, NOT `./backend`, just `backend`)

### Step 4: Set Start Command
1. Find **"Start Command"** field
2. Delete anything that's there
3. Type exactly:
   ```
   python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

### Step 5: Save and Redeploy
1. Click **"Save"** or **"Update"**
2. Railway will automatically redeploy
3. OR click **"Deployments"** tab → **"Redeploy"**

### Step 6: Watch the Logs
1. Click **"Deployments"** tab
2. Click on the latest deployment
3. Click **"View Logs"**
4. Watch for errors

## 🎯 What Should Happen

You should see in the logs:
```
Installing dependencies...
✓ pip install -r requirements.txt
Starting server...
✓ uvicorn running on port XXXX
```

## ❌ If You Still See Errors

### Copy the Exact Error Message

From Railway logs, copy the **exact error text** and share it. Common ones:

**"ModuleNotFoundError: No module named 'app'"**
→ Root Directory is wrong (should be `backend`)

**"uvicorn: command not found"**
→ Start Command is wrong (should use `python -m uvicorn`)

**"Port already in use"**
→ Not using `$PORT` variable

**"Database error"**
→ Database will auto-create, this is usually OK

## 📸 Visual Guide

Your Railway Settings should look like this:

```
Service Settings
├── Root Directory: backend
├── Start Command: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
└── Build Command: (leave empty or: pip install -r requirements.txt)
```

## 🔄 Alternative: Use Startup Script

If the direct command doesn't work, try:

**Start Command:**
```
bash start.sh
```

This uses the startup script that handles everything.

## ✅ Verification

After deployment succeeds:
1. Railway will give you a URL like: `https://your-app.railway.app`
2. Test it: Visit `https://your-app.railway.app/health`
3. Should return: `{"status":"healthy"}`
4. API docs: `https://your-app.railway.app/docs`

## 🆘 Still Not Working?

**Please provide:**
1. Screenshot of Railway Settings (Root Directory and Start Command)
2. The exact error from Railway logs
3. What you see when you visit the Railway URL

With that, I can give you the exact fix!
