from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1 import auth, budgets, expenses, revenues, seasons, teams, organizations, quick_actions, transparency, imports

# Initialize database on startup
try:
    from app.startup import init_db
    init_db()
except Exception as e:
    print(f"Database initialization note: {e}")

app = FastAPI(
    title="Youth Sports Budget API",
    description="Budgeting and financial management for youth sports organizations",
    version="1.0.0"
)

# CORS middleware
# Allow all origins in production (you can restrict this later)
import os
allowed_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:5174,http://localhost:5173,http://localhost:3001"
).split(",")

# Allow all origins for Railway deployment (restrict in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for Railway - update with your Netlify URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(organizations.router, prefix="/api/v1/organizations", tags=["Organizations"])
app.include_router(seasons.router, prefix="/api/v1/seasons", tags=["Seasons"])
app.include_router(teams.router, prefix="/api/v1/teams", tags=["Teams"])
app.include_router(budgets.router, prefix="/api/v1/budgets", tags=["Budgets"])
app.include_router(expenses.router, prefix="/api/v1/expenses", tags=["Expenses"])
app.include_router(revenues.router, prefix="/api/v1/revenues", tags=["Revenues"])
app.include_router(quick_actions.router, prefix="/api/v1/quick", tags=["Quick Actions"])
app.include_router(transparency.router, prefix="/api/v1/transparency", tags=["Financial Transparency"])
app.include_router(imports.router, prefix="/api/v1/import", tags=["Data Import"])


@app.get("/")
def root():
    return {
        "message": "Youth Sports Budget API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
