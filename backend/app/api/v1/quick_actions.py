from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from datetime import date
from app.database import get_db
from app.models import Expense, Revenue, Team, Season, ExpenseCategory
from app.schemas import BulkRegistrationFeeEntry, QuickExpenseEntry

router = APIRouter()


@router.post("/bulk-registration-fees", status_code=status.HTTP_201_CREATED)
async def bulk_registration_fees(
    entry: BulkRegistrationFeeEntry,
    db: Session = Depends(get_db)
):
    """Quick entry for bulk registration fees - creates revenue entries"""
    team = db.query(Team).filter(Team.id == entry.team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    season = db.query(Season).filter(Season.id == team.season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    total_amount = entry.player_count * entry.fee_per_player
    
    # Create revenue entry for registration fees
    from app.models import RevenueCategory
    new_revenue = Revenue(
        season_id=team.season_id,
        team_id=team.id,
        category=RevenueCategory.REGISTRATION_FEES,
        description=f"Registration fees for {entry.player_count} players @ ${entry.fee_per_player}",
        amount=total_amount,
        source=f"{team.name} - {entry.player_count} players",
        payment_date=entry.payment_date,
        notes=entry.notes or f"Bulk registration: {entry.player_count} players",
        created_by="anonymous"
    )
    
    db.add(new_revenue)
    
    # Update team player count
    team.current_players = entry.player_count
    team.registration_fee = entry.fee_per_player
    
    db.commit()
    db.refresh(new_revenue)
    
    return {
        "message": f"Recorded ${total_amount} in registration fees for {entry.player_count} players",
        "revenue_id": new_revenue.id,
        "total_amount": total_amount
    }


@router.post("/quick-expense", status_code=status.HTTP_201_CREATED)
async def quick_expense(
    entry: QuickExpenseEntry,
    category: str = Query(...),
    season_id: str = Query(...),
    db: Session = Depends(get_db)
):
    """Quick expense entry with common defaults"""
    team = db.query(Team).filter(Team.id == entry.team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Verify season exists
    season = db.query(Season).filter(Season.id == season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    # Calculate per-player cost if player_count provided
    per_player_cost = None
    if entry.player_count and entry.player_count > 0:
        per_player_cost = entry.amount / entry.player_count
        description = f"{entry.description} ({entry.player_count} players @ ${per_player_cost:.2f} each)"
    else:
        description = entry.description
    
    # Convert category string to enum
    try:
        expense_category = ExpenseCategory(category)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid expense category: {category}"
        )
    
    new_expense = Expense(
        season_id=season_id,
        team_id=entry.team_id,
        category=expense_category,
        description=description,
        amount=entry.amount,
        payment_date=entry.payment_date,
        created_by="anonymous"
    )
    
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    
    return {
        "message": f"Recorded ${entry.amount} expense",
        "expense_id": new_expense.id,
        "per_player_cost": per_player_cost
    }
