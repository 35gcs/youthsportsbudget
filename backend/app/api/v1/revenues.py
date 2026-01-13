from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database import get_db
from app.models import Revenue, Season, Team
from app.schemas import RevenueCreate, RevenueResponse
from app.core.dependencies import get_current_user, require_coach_or_admin

router = APIRouter()


@router.get("/", response_model=List[RevenueResponse])
async def get_revenues(
    season_id: Optional[str] = Query(None),
    team_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get revenues with optional filters"""
    query = db.query(Revenue)
    
    if season_id:
        query = query.filter(Revenue.season_id == season_id)
    if team_id:
        query = query.filter(Revenue.team_id == team_id)
    if category:
        query = query.filter(Revenue.category == category)
    
    revenues = query.order_by(Revenue.payment_date.desc()).all()
    return revenues


@router.post("/", response_model=RevenueResponse, status_code=status.HTTP_201_CREATED)
async def create_revenue(
    revenue_data: RevenueCreate,
    db: Session = Depends(get_db)
):
    """Create a new revenue entry"""
    # Verify season exists
    season = db.query(Season).filter(Season.id == revenue_data.season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    # Verify team exists if provided
    if revenue_data.team_id:
        team = db.query(Team).filter(Team.id == revenue_data.team_id).first()
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
    
    new_revenue = Revenue(
        season_id=revenue_data.season_id,
        team_id=revenue_data.team_id,
        category=revenue_data.category,
        description=revenue_data.description,
        amount=revenue_data.amount,
        source=revenue_data.source,
        payment_date=revenue_data.payment_date,
        notes=revenue_data.notes,
        created_by="anonymous"  # No auth required
    )
    
    db.add(new_revenue)
    db.commit()
    db.refresh(new_revenue)
    
    return new_revenue


@router.get("/{revenue_id}", response_model=RevenueResponse)
async def get_revenue(
    revenue_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific revenue entry"""
    revenue = db.query(Revenue).filter(Revenue.id == revenue_id).first()
    if not revenue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Revenue not found"
        )
    return revenue


@router.delete("/{revenue_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_revenue(
    revenue_id: str,
    db: Session = Depends(get_db)
):
    """Delete a revenue entry"""
    revenue = db.query(Revenue).filter(Revenue.id == revenue_id).first()
    if not revenue:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Revenue not found"
        )
    
    db.delete(revenue)
    db.commit()
    return None
