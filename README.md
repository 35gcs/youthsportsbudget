# 🏀 Youth Sports Budget Manager

A comprehensive budgeting and financial management tool designed specifically for youth sports organizations. Track expenses, manage revenues, monitor budgets, and provide financial transparency to parents and stakeholders.

## ✨ Features

- **Season & Team Management** - Organize your sports programs by seasons and teams
- **Budget Tracking** - Set budgets and track spending in real-time
- **Expense Management** - Log and categorize all expenses (equipment, uniforms, field rental, etc.)
- **Revenue Tracking** - Track registration fees, sponsorships, fundraisers, and more
- **Quick Entry** - Fast bulk entry for registration fees and common expenses
- **Financial Transparency** - Generate public reports showing per-player costs
- **Team Filtering** - View financials filtered by specific teams
- **Bulk Import** - Import multiple seasons, teams, expenses, and revenues via CSV
- **Dashboard** - Real-time financial overview with profit/loss tracking

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.9+ (for backend)
- npm or yarn

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:3000

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app/db_init.py
uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000

## 📁 Project Structure

```
youth-sports-budget/
├── frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── components/  # Reusable components
│   │   ├── services/ # API services
│   │   └── types/    # TypeScript types
│   └── dist/         # Production build
├── backend/          # FastAPI + Python
│   ├── app/
│   │   ├── api/v1/   # API endpoints
│   │   ├── models.py # Database models
│   │   ├── schemas.py # Pydantic schemas
│   │   └── main.py   # FastAPI app
│   └── requirements.txt
└── README.md
```

## 🌐 Deployment

### Frontend (Netlify)

1. Build: `cd frontend && npm run build`
2. Deploy `dist/` folder to [Netlify Drop](https://app.netlify.com/drop)
3. Add environment variable: `VITE_API_URL` = your backend URL

### Backend (Railway/Render)

See `BACKEND_SETUP.md` for detailed deployment instructions.

**Recommended:** Railway (easiest) or Render (free tier)

## 🛠️ Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Router
- Axios

**Backend:**
- FastAPI
- Python 3.9+
- SQLAlchemy
- Pydantic v2
- SQLite (default, PostgreSQL for production)

## 📖 Usage

1. **Create a Season** - Set up your sports season with dates
2. **Add Teams** - Create teams for the season
3. **Set Budgets** - Allocate budget by category
4. **Track Expenses** - Log purchases and costs
5. **Record Revenue** - Track income sources
6. **View Dashboard** - Monitor financial health
7. **Generate Reports** - Create transparency reports

## 📝 License

MIT License - feel free to use for your organization!

## 🤝 Contributing

This is a tool for youth sports organizations. Contributions welcome!

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ for youth sports organizations
