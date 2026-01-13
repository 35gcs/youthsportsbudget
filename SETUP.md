# 🏀 Youth Sports Budget Tool - Setup Guide

Complete setup instructions for the Youth Sports Budgeting Tool.

## 📋 Prerequisites

- Python 3.8+ (for backend)
- Node.js 18+ and npm (for frontend)

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python app/db_init.py

# Start the server
uvicorn app.main:app --reload
```

Backend will run at: **http://localhost:8000**
API Documentation: **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run at: **http://localhost:3000** (or next available port)

## 🔐 First Time Setup

1. Open http://localhost:3000 (check terminal for actual port if different)
2. Click "Sign up" to create an admin account
3. Log in with your credentials
4. Create your first season
5. Add teams
6. Set budgets
7. Start tracking expenses and revenues!

## 📊 Key Features

### For Administrators:
- ✅ Create and manage seasons (Spring, Summer, Fall, Winter)
- ✅ Add teams with age groups and sports
- ✅ Set budgets by category (equipment, uniforms, field rental, etc.)
- ✅ Track all expenses with receipts
- ✅ Record revenue sources (registration fees, sponsorships, fundraisers)
- ✅ View comprehensive financial reports
- ✅ Monitor budget vs actual spending

### Sports-Specific Categories:

**Expenses:**
- Equipment (balls, nets, goals)
- Uniforms & Apparel
- Field/Facility Rental
- Referee/Umpire Fees
- Coaching Stipends
- Travel & Transportation
- Tournament Fees
- Insurance
- First Aid & Medical Supplies
- Awards & Trophies
- Marketing & Promotion
- Administration

**Revenue:**
- Registration Fees
- Sponsorships
- Fundraisers
- Concessions
- Merchandise Sales
- Donations

## 🎯 Typical Workflow

1. **Create a Season** - Set up Spring 2024, Fall 2024, etc.
2. **Add Teams** - Create teams like "U10 Boys Soccer", "U12 Girls Basketball"
3. **Set Budgets** - Allocate budget for each category
4. **Track Expenses** - Record every purchase with category and receipt
5. **Record Revenue** - Log registration fees, sponsorships, fundraisers
6. **Monitor Dashboard** - See real-time budget status
7. **Generate Reports** - Export financial summaries

## 📱 Usage Tips

- **Filter by Season**: Use season filters to focus on specific time periods
- **Team vs Season-wide**: Expenses/revenues can be assigned to specific teams or the entire season
- **Budget Alerts**: Dashboard shows when you're approaching budget limits
- **Category Tracking**: See exactly where money is being spent
- **Profit/Loss**: Monitor financial health per season

## 🔧 Configuration

### Backend Environment Variables

Create `backend/.env`:
```env
DATABASE_URL=sqlite:///./youth_sports_budget.db
SECRET_KEY=your-secret-key-here
```

### Frontend Environment Variables

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000/api/v1
```

## 📦 Production Deployment

### Backend:
1. Set strong `SECRET_KEY`
2. Use PostgreSQL instead of SQLite
3. Configure CORS for your domain
4. Use production ASGI server (Gunicorn)

### Frontend:
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or your hosting
3. Update API URL in environment variables

## 🆘 Troubleshooting

**Backend won't start:**
- Check Python version (3.8+)
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

**Frontend won't start:**
- Check Node.js version (18+)
- Delete `node_modules` and run `npm install` again
- Check if backend is running on port 8000

**Database errors:**
- Delete `youth_sports_budget.db` and run `python app/db_init.py` again

## 📚 Documentation

- Backend API docs: http://localhost:8000/docs
- All endpoints are RESTful and well-documented

## ✅ You're Ready!

The tool is now set up and ready for your local sports administrator to use. They can start tracking budgets, expenses, and revenues immediately!
