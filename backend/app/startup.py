"""
Startup script to initialize database on first run
"""
from app.database import engine, Base
from app.models import (
    User, Organization, Season, Team, Budget, Expense, Revenue, Player, QuickExpenseTemplate
)

def init_db():
    """Initialize database tables"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️ Database init warning: {e}")

# Auto-initialize on import
init_db()
