from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models import Team, Season
from app.schemas import TeamCreate, TeamResponse
from app.core.dependencies import get_current_user, require_admin

router = APIRouter()


@router.get("/", response_model=List[TeamResponse])
async def get_teams(
    season_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all teams, optionally filtered by season"""
    query = db.query(Team)
    if season_id:
        query = query.filter(Team.season_id == season_id)
    
    teams = query.all()
    return teams


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreate,
    db: Session = Depends(get_db)
):
    """Create a new team"""
    # Verify season exists
    season = db.query(Season).filter(Season.id == team_data.season_id).first()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Season not found"
        )
    
    new_team = Team(
        season_id=team_data.season_id,
        name=team_data.name,
        age_group=team_data.age_group,
        sport=team_data.sport,
        gender=team_data.gender,
        max_players=team_data.max_players,
        registration_fee=team_data.registration_fee,
        coach_id=team_data.coach_id
    )
    
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    
    return new_team


@router.get("/{team_id}", response_model=TeamResponse)
async def get_team(
    team_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific team"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    return team
