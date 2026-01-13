#!/bin/bash
set -e

echo "🚀 Starting Youth Sports Budget API..."

# Initialize database (will auto-create tables on first run)
echo "📦 Initializing database..."
python -c "
from app.database import engine, Base
from app.models import *
try:
    Base.metadata.create_all(bind=engine)
    print('✅ Database ready')
except Exception as e:
    print(f'⚠️ Database note: {e}')
" || echo "Database will initialize on first request"

# Start the server
echo "🌐 Starting uvicorn server on port ${PORT:-8000}..."
exec python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
