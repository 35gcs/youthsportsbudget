from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.database import get_db
from app.models import Organization, Season, Team, Expense, Revenue, Budget, Player
from app.schemas import TransparencyReport, PlayerCostBreakdown

router = APIRouter()


@router.get("/season/{season_id}/report", response_model=TransparencyReport)
async def get_season_transparency_report(
    season_id: str,
    db: Session = Depends(get_db)
):
    """Get financial transparency report for a season"""
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
    
    # Expenses by category
    expenses_by_category = {}
    expenses = db.query(Expense.category, func.sum(Expense.amount)).filter(
        Expense.season_id == season_id
    ).group_by(Expense.category).all()
    
    for category, amount in expenses:
        expenses_by_category[category.value] = float(amount)
    
    # Revenues by category
    revenues_by_category = {}
    revenues = db.query(Revenue.category, func.sum(Revenue.amount)).filter(
        Revenue.season_id == season_id
    ).group_by(Revenue.category).all()
    
    for category, amount in revenues:
        revenues_by_category[category.value] = float(amount)
    
    # Player cost breakdown
    teams = db.query(Team).filter(Team.season_id == season_id).all()
    player_breakdowns = []
    
    for team in teams:
        team_expenses = db.query(func.sum(Expense.amount)).filter(
            Expense.team_id == team.id
        ).scalar() or 0.0
        
        registration_fees = db.query(func.sum(Player.registration_fee_amount)).filter(
            Player.team_id == team.id,
            Player.registration_fee_paid == True
        ).scalar() or 0.0
        
        total_cost = float(team_expenses)
        player_count = team.current_players or 1
        cost_per_player = total_cost / player_count if player_count > 0 else 0
        
        # Breakdown by category
        category_breakdown = {}
        team_expenses_by_cat = db.query(Expense.category, func.sum(Expense.amount)).filter(
            Expense.team_id == team.id
        ).group_by(Expense.category).all()
        
        for cat, amt in team_expenses_by_cat:
            category_breakdown[cat.value] = float(amt)
        
        player_breakdowns.append(PlayerCostBreakdown(
            team_id=team.id,
            team_name=team.name,
            total_cost=total_cost,
            player_count=player_count,
            cost_per_player=cost_per_player,
            registration_fee=float(registration_fees),
            other_costs=total_cost - float(registration_fees),
            breakdown_by_category=category_breakdown
        ))
    
    return TransparencyReport(
        organization_id="",
        organization_name=season.name,
        season_id=season_id,
        total_budgeted=float(total_budgeted),
        total_expenses=float(total_expenses),
        total_revenue=float(total_revenue),
        expenses_by_category=expenses_by_category,
        revenues_by_category=revenues_by_category,
        player_cost_breakdown=player_breakdowns,
        profit_loss=float(total_revenue - total_expenses)
    )


@router.get("/organization/{org_id}/report", response_model=TransparencyReport)
async def get_transparency_report(
    org_id: str,
    season_id: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Get financial transparency report for an organization"""
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    
    # Get seasons
    query = db.query(Season).filter(Season.organization_id == org_id)
    if season_id:
        query = query.filter(Season.id == season_id)
    seasons = query.all()
    
    if not seasons:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No seasons found for this organization"
        )
    
    season_ids = [s.id for s in seasons]
    
    # Calculate totals
    total_budgeted = db.query(func.sum(Budget.budgeted_amount)).filter(
        Budget.season_id.in_(season_ids)
    ).scalar() or 0.0
    
    total_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.season_id.in_(season_ids)
    ).scalar() or 0.0
    
    total_revenue = db.query(func.sum(Revenue.amount)).filter(
        Revenue.season_id.in_(season_ids)
    ).scalar() or 0.0
    
    # Expenses by category
    expenses_by_category = {}
    expenses = db.query(Expense.category, func.sum(Expense.amount)).filter(
        Expense.season_id.in_(season_ids)
    ).group_by(Expense.category).all()
    
    for category, amount in expenses:
        expenses_by_category[category.value] = float(amount)
    
    # Revenues by category
    revenues_by_category = {}
    revenues = db.query(Revenue.category, func.sum(Revenue.amount)).filter(
        Revenue.season_id.in_(season_ids)
    ).group_by(Revenue.category).all()
    
    for category, amount in revenues:
        revenues_by_category[category.value] = float(amount)
    
    # Player cost breakdown
    teams = db.query(Team).filter(Team.season_id.in_(season_ids)).all()
    player_breakdowns = []
    
    for team in teams:
        team_expenses = db.query(func.sum(Expense.amount)).filter(
            Expense.team_id == team.id
        ).scalar() or 0.0
        
        team_revenues = db.query(func.sum(Revenue.amount)).filter(
            Revenue.team_id == team.id
        ).scalar() or 0.0
        
        registration_fees = db.query(func.sum(Player.registration_fee_amount)).filter(
            Player.team_id == team.id,
            Player.registration_fee_paid == True
        ).scalar() or 0.0
        
        total_cost = float(team_expenses)
        player_count = team.current_players or 1
        cost_per_player = total_cost / player_count if player_count > 0 else 0
        
        # Breakdown by category
        category_breakdown = {}
        team_expenses_by_cat = db.query(Expense.category, func.sum(Expense.amount)).filter(
            Expense.team_id == team.id
        ).group_by(Expense.category).all()
        
        for cat, amt in team_expenses_by_cat:
            category_breakdown[cat.value] = float(amt)
        
        player_breakdowns.append(PlayerCostBreakdown(
            team_id=team.id,
            team_name=team.name,
            total_cost=total_cost,
            player_count=player_count,
            cost_per_player=cost_per_player,
            registration_fee=float(registration_fees),
            other_costs=total_cost - float(registration_fees),
            breakdown_by_category=category_breakdown
        ))
    
    return TransparencyReport(
        organization_id=org.id,
        organization_name=org.name,
        season_id=season_id,
        total_budgeted=float(total_budgeted),
        total_expenses=float(total_expenses),
        total_revenue=float(total_revenue),
        expenses_by_category=expenses_by_category,
        revenues_by_category=revenues_by_category,
        player_cost_breakdown=player_breakdowns,
        profit_loss=float(total_revenue - total_expenses)
    )


@router.get("/team/{team_id}/player-costs", response_model=PlayerCostBreakdown)
async def get_team_player_costs(
    team_id: str,
    db: Session = Depends(get_db)
):
    """Get per-player cost breakdown for a specific team"""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    team_expenses = db.query(func.sum(Expense.amount)).filter(
        Expense.team_id == team.id
    ).scalar() or 0.0
    
    registration_fees = db.query(func.sum(Player.registration_fee_amount)).filter(
        Player.team_id == team.id,
        Player.registration_fee_paid == True
    ).scalar() or 0.0
    
    total_cost = float(team_expenses)
    player_count = team.current_players or 1
    cost_per_player = total_cost / player_count if player_count > 0 else 0
    
    # Breakdown by category
    category_breakdown = {}
    team_expenses_by_cat = db.query(Expense.category, func.sum(Expense.amount)).filter(
        Expense.team_id == team.id
    ).group_by(Expense.category).all()
    
    for cat, amt in team_expenses_by_cat:
        category_breakdown[cat.value] = float(amt)
    
    return PlayerCostBreakdown(
        team_id=team.id,
        team_name=team.name,
        total_cost=total_cost,
        player_count=player_count,
        cost_per_player=cost_per_player,
        registration_fee=float(registration_fees),
        other_costs=total_cost - float(registration_fees),
        breakdown_by_category=category_breakdown
    )
