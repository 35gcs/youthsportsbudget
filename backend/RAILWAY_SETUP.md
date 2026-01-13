# 🚂 Railway Deployment Setup

## Quick Fix for Railway Errors

### Common Issues & Solutions

#### 1. **Railpack Process Exited Error**

This usually means:
- Missing startup command
- Database initialization failed
- Import errors

### Solution: Configure Railway Properly

#### In Railway Dashboard:

1. **Go to your service settings**
2. **Set Root Directory:** `backend`
3. **Set Start Command:** 
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. **Set Build Command (optional):**
   ```
   pip install -r requirements.txt
   ```

#### Environment Variables:

Add these in Railway:
- `PORT` - Railway sets this automatically
- `DATABASE_URL` - Optional (defaults to SQLite)

### Alternative: Use the Provided Files

I've created these files to help:

1. **`Procfile`** - Tells Railway how to start the app
2. **`railway.json`** - Railway configuration
3. **`start.sh`** - Startup script with database init
4. **`runtime.txt`** - Python version

### Manual Setup Steps:

1. **In Railway:**
   - Service → Settings
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Or use the startup script:**
   - Start Command: `bash start.sh`

3. **Initialize database:**
   - Railway → Deployments → View Logs
   - Check if database was created
   - If not, run manually in Railway shell:
     ```
     python app/db_init.py
     ```

### Testing Locally First

Before deploying, test locally:

```bash
cd backend
pip install -r requirements.txt
python app/db_init.py
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

If this works locally, it should work on Railway.

### Common Error Messages:

**"ModuleNotFoundError: No module named 'app'"**
- Fix: Set Root Directory to `backend` in Railway

**"Database not found"**
- Fix: Database will be created automatically, or run `python app/db_init.py`

**"Port already in use"**
- Fix: Use `$PORT` environment variable (Railway sets this)

### Still Having Issues?

Check Railway logs:
1. Go to Railway dashboard
2. Click on your service
3. Click "Deployments" tab
4. Click on latest deployment
5. View logs to see exact error

The logs will show the exact error message to help debug!
