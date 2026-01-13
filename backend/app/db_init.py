"""
Initialize the database - creates all tables
Run this once to set up your database
"""
import sys
import os

# Add backend to path if needed
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import engine, Base
from app.models import (
    User, Organization, Season, Team, Budget, Expense, Revenue, Player, QuickExpenseTemplate
)

if __name__ == "__main__":
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        print("\nYou can now start the server with:")
        print("  uvicorn app.main:app --reload")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
