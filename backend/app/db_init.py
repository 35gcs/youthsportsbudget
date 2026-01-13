"""
Initialize the database - creates all tables
Run this once to set up your database
"""
from app.database import engine, Base
from app.models import (
    User, Organization, Season, Team, Budget, Expense, Revenue, Player, QuickExpenseTemplate
)

if __name__ == "__main__":
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully!")
    print("\nYou can now start the server with:")
    print("  uvicorn app.main:app --reload")
