from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models import Expense, Season, Team
from app.schemas import ExpenseCreate, ExpenseResponse
from app.core.dependencies import get_current_user, require_coach_or_admin

router = APIRouter()


@router.get("/", response_model=List[ExpenseResponse])
async def get_expenses(
    season_id: Optional[str] = Query(None),
    team_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get expenses with optional filters"""
    query = db.query(Expense)
    
    if season_id:
        query = query.filter(Expense.season_id == season_id)
    if team_id:
        query = query.filter(Expense.team_id == team_id)
    if category:
        query = query.filter(Expense.category == category)
    
    expenses = query.order_by(Expense.payment_date.desc()).all()
    return expenses


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db)
):
    """Create a new expense"""
    # Verify season exists
    season = db.query(Season).filter(Season.id == expense_data.season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    # Verify team exists if provided
    if expense_data.team_id:
        team = db.query(Team).filter(Team.id == expense_data.team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
    
    new_expense = Expense(
        season_id=expense_data.season_id,
        team_id=expense_data.team_id,
        category=expense_data.category,
        description=expense_data.description,
        amount=expense_data.amount,
        vendor=expense_data.vendor,
        receipt_number=expense_data.receipt_number,
        payment_date=expense_data.payment_date,
        notes=expense_data.notes,
        created_by="anonymous"  # No auth required
    )
    
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    
    return new_expense


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_expense(
    expense_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific expense"""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    expense_id: str,
    db: Session = Depends(get_db)
):
    """Delete an expense"""
    expense = db.query(Expense).filter(Expense.id == expense_id).first()
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found"
        )
    
    db.delete(expense)
    db.commit()
    return None
