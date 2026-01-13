# 🔧 Troubleshooting Guide

## Frontend Won't Start

### Issue: Port Already in Use

If you get an error like "Port 3000 is already in use":

**Solution 1: Use a different port**
```bash
# In frontend directory, edit vite.config.ts and change the port number
# Or run with a specific port:
npm run dev -- --port 3001
```

**Solution 2: Find and kill the process using the port**
```bash
# On macOS/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: Dependencies Not Installed

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

**Solution:**
```bash
cd frontend
npm install
# If errors persist, check tsconfig.json is correct
```

### Issue: Module Not Found

**Solution:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

## Backend Won't Start

### Issue: Port 8000 Already in Use

**Solution:**
```bash
# Find and kill the process
lsof -ti:8000 | xargs kill -9

# Or change the port in uvicorn command:
uvicorn app.main:app --reload --port 8001
```

### Issue: Database Errors

**Solution:**
```bash
cd backend
# Delete the database file
rm youth_sports_budget.db
# Recreate it
python app/db_init.py
```

### Issue: Import Errors

**Solution:**
```bash
cd backend
# Make sure virtual environment is activated
source venv/bin/activate  # or venv\Scripts\activate on Windows
# Reinstall dependencies
pip install -r requirements.txt
```

## Common Issues

### CORS Errors

If you see CORS errors in the browser console:

1. Make sure backend is running on port 8000
2. Check that frontend URL is in backend's CORS allowed origins
3. Restart both servers

### Authentication Not Working

1. Clear browser localStorage:
   - Open browser DevTools (F12)
   - Go to Application/Storage tab
   - Clear Local Storage
2. Try logging in again

### API Connection Failed

1. Check backend is running: http://localhost:8000/health
2. Check backend API docs: http://localhost:8000/docs
3. Verify frontend is using correct API URL in `.env` or `vite.config.ts`

## Quick Fix Commands

```bash
# Frontend - Clean install
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev

# Backend - Clean install
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app/db_init.py
uvicorn app.main:app --reload
```

## Still Not Working?

1. Check both terminals for error messages
2. Make sure Python 3.8+ and Node.js 18+ are installed
3. Try running on completely different ports:
   - Backend: `uvicorn app.main:app --reload --port 8001`
   - Frontend: `npm run dev -- --port 3001`
4. Check firewall/antivirus isn't blocking ports
