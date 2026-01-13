from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from app.database import get_db
from app.models import Budget, Season, Team, Expense, Revenue
from app.schemas import BudgetCreate, BudgetResponse, BudgetSummary, TeamBudgetSummary
from app.core.dependencies import get_current_user, require_admin

router = APIRouter()


@router.get("/", response_model=List[BudgetResponse])
async def get_budgets(
    season_id: Optional[str] = Query(None),
    team_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get budgets with optional filters"""
    query = db.query(Budget)
    
    if season_id:
        query = query.filter(Budget.season_id == season_id)
    if team_id:
        query = query.filter(Budget.team_id == team_id)
    
    budgets = query.all()
    return budgets


@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget(
    budget_data: BudgetCreate,
    db: Session = Depends(get_db)
):
    """Create a new budget"""
    # Verify season exists
    season = db.query(Season).filter(Season.id == budget_data.season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    # Verify team exists if provided
    if budget_data.team_id:
        team = db.query(Team).filter(Team.id == budget_data.team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
    
    new_budget = Budget(
        season_id=budget_data.season_id,
        team_id=budget_data.team_id,
        category=budget_data.category,
        budgeted_amount=budget_data.budgeted_amount,
        notes=budget_data.notes
    )
    
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    
    return new_budget


@router.get("/summary", response_model=BudgetSummary)
async def get_budget_summary(
    season_id: str = Query(...),
    db: Session = Depends(get_db)
):
    """Get budget summary for a season"""
    season = db.query(Season).filter(Season.id == season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    # Calculate totals
    total_budgeted = db.query(func.sum(Budget.budgeted_amount)).filter(
        Budget.season_id == season_id
    ).scalar() or 0.0
    
    total_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.season_id == season_id
    ).scalar() or 0.0
    
    total_revenue = db.query(func.sum(Revenue.amount)).filter(
        Revenue.season_id == season_id
    ).scalar() or 0.0
    
    remaining_budget = total_budgeted - total_expenses
    profit_loss = total_revenue - total_expenses
    
    return BudgetSummary(
        season_id=season.id,
        season_name=season.name,
        total_budgeted=float(total_budgeted),
        total_expenses=float(total_expenses),
        total_revenue=float(total_revenue),
        remaining_budget=float(remaining_budget),
        profit_loss=float(profit_loss)
    )


@router.get("/team/{team_id}/summary", response_model=TeamBudgetSummary)
async def get_team_budget_summary(
    team_id: str,
    db: Session = Depends(get_db)
):
    """Get budget summary for a specific team"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Calculate totals
    total_budgeted = db.query(func.sum(Budget.budgeted_amount)).filter(
        Budget.team_id == team_id
    ).scalar() or 0.0
    
    total_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.team_id == team_id
    ).scalar() or 0.0
    
    total_revenue = db.query(func.sum(Revenue.amount)).filter(
        Revenue.team_id == team_id
    ).scalar() or 0.0
    
    # Registration fees
    from app.models import Player
    registration_fees_collected = db.query(func.sum(Player.registration_fee_amount)).filter(
        Player.team_id == team_id,
        Player.registration_fee_paid == True
    ).scalar() or 0.0
    
    registration_fees_expected = team.current_players * team.registration_fee
    
    remaining_budget = total_budgeted - total_expenses
    profit_loss = total_revenue - total_expenses
    
    return TeamBudgetSummary(
        team_id=team.id,
        team_name=team.name,
        total_budgeted=float(total_budgeted),
        total_expenses=float(total_expenses),
        total_revenue=float(total_revenue),
        remaining_budget=float(remaining_budget),
        profit_loss=float(profit_loss),
        player_count=team.current_players,
        registration_fees_collected=float(registration_fees_collected),
        registration_fees_expected=float(registration_fees_expected)
    )
