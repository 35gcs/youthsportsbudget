#!/bin/bash

# Railway startup script
echo "Starting Youth Sports Budget API..."

# Initialize database if it doesn't exist
if [ ! -f "youth_sports_budget.db" ]; then
    echo "Initializing database..."
    python app/db_init.py
fi

# Start the server
echo "Starting uvicorn server..."
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
