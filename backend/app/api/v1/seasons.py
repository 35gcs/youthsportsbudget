from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Season
from app.schemas import SeasonCreate, SeasonResponse
from app.core.dependencies import get_current_user, require_admin

router = APIRouter()


@router.get("/", response_model=List[SeasonResponse])
async def get_seasons(
    db: Session = Depends(get_db)
):
    """Get all seasons"""
    seasons = db.query(Season).order_by(Season.year.desc(), Season.start_date.desc()).all()
    return seasons


@router.post("/", response_model=SeasonResponse, status_code=status.HTTP_201_CREATED)
async def create_season(
    season_data: SeasonCreate,
    db: Session = Depends(get_db)
):
    """Create a new season"""
    try:
        new_season = Season(
            name=season_data.name,
            season_type=season_data.season_type,
            year=season_data.year,
            start_date=season_data.start_date,
            end_date=season_data.end_date,
            is_active=season_data.is_active,
            organization_id=season_data.organization_id
        )
        
        db.add(new_season)
        db.commit()
        db.refresh(new_season)
        
        return new_season
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating season: {str(e)}"
        )


@router.get("/{season_id}", response_model=SeasonResponse)
async def get_season(
    season_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific season"""
    season = db.query(Season).filter(Season.id == season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    return season


@router.put("/{season_id}", response_model=SeasonResponse)
async def update_season(
    season_id: str,
    season_data: SeasonCreate,
    db: Session = Depends(get_db)
):
    """Update a season"""
    season = db.query(Season).filter(Season.id == season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    try:
        season.name = season_data.name
        season.season_type = season_data.season_type
        season.year = season_data.year
        season.start_date = season_data.start_date
        season.end_date = season_data.end_date
        season.is_active = season_data.is_active
        season.organization_id = season_data.organization_id
        
        db.commit()
        db.refresh(season)
        
        return season
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating season: {str(e)}"
        )


@router.delete("/{season_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_season(
    season_id: str,
    db: Session = Depends(get_db)
):
    """Delete a season"""
    season = db.query(Season).filter(Season.id == season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    try:
        db.delete(season)
        db.commit()
        return None
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting season: {str(e)}"
        )
