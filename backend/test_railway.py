#!/usr/bin/env python3
"""
Test script to verify the app works before deploying to Railway
Run this locally: python test_railway.py
"""
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("Testing Railway deployment setup...")
print("=" * 50)

# Test 1: Check Python version
print(f"✓ Python version: {sys.version}")

# Test 2: Check imports
try:
    from app.database import engine, Base
    print("✓ Database imports OK")
except Exception as e:
    print(f"✗ Database import failed: {e}")
    sys.exit(1)

try:
    from app.models import *
    print("✓ Models import OK")
except Exception as e:
    print(f"✗ Models import failed: {e}")
    sys.exit(1)

try:
    from app.main import app
    print("✓ Main app imports OK")
except Exception as e:
    print(f"✗ Main app import failed: {e}")
    sys.exit(1)

# Test 3: Check database initialization
try:
    Base.metadata.create_all(bind=engine)
    print("✓ Database tables can be created")
except Exception as e:
    print(f"✗ Database creation failed: {e}")
    sys.exit(1)

# Test 4: Check uvicorn
try:
    import uvicorn
    print(f"✓ Uvicorn installed: {uvicorn.__version__}")
except ImportError:
    print("✗ Uvicorn not installed")
    sys.exit(1)

print("=" * 50)
print("✅ All tests passed! Ready for Railway deployment.")
print("\nStart command for Railway:")
print("python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT")
