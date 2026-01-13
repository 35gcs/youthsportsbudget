#!/bin/bash

# Railway startup script
echo "Starting Youth Sports Budget API..."

# Initialize database
echo "Initializing database..."
python -c "from app.database import engine, Base; from app.models import *; Base.metadata.create_all(bind=engine); print('Database initialized')" || python app/db_init.py

# Start the server
echo "Starting uvicorn server on port ${PORT:-8000}..."
python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
