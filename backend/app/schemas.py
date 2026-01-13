from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime
from app.models import (
    UserRole, SeasonType, ExpenseCategory, RevenueCategory
)


# Organization schemas
class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    is_public: bool = False


class OrganizationCreate(OrganizationBase):
    pass


class OrganizationResponse(OrganizationBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole = UserRole.VIEWER
    phone_number: Optional[str] = None
    organization_id: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Auth schemas
class LoginCredentials(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


# Season schemas
class SeasonBase(BaseModel):
    name: str
    season_type: SeasonType
    year: int
    start_date: date
    end_date: date
    is_active: bool = True
    organization_id: Optional[str] = None


class SeasonCreate(SeasonBase):
    pass


class SeasonResponse(SeasonBase):
    id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Team schemas
class TeamBase(BaseModel):
    name: str
    age_group: str
    sport: str
    gender: Optional[str] = None
    max_players: int = 20
    registration_fee: float = 0.0


class TeamCreate(TeamBase):
    season_id: str
    coach_id: Optional[str] = None


class TeamResponse(TeamBase):
    id: str
    season_id: str
    coach_id: Optional[str] = None
    current_players: int
    created_at: datetime

    model_config = {"from_attributes": True}


# Budget schemas
class BudgetBase(BaseModel):
    category: str
    budgeted_amount: float
    notes: Optional[str] = None


class BudgetCreate(BudgetBase):
    season_id: str
    team_id: Optional[str] = None


class BudgetResponse(BudgetBase):
    id: str
    season_id: str
    team_id: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# Expense schemas
class ExpenseBase(BaseModel):
    category: ExpenseCategory
    description: str
    amount: float
    vendor: Optional[str] = None
    receipt_number: Optional[str] = None
    payment_date: date
    notes: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    season_id: str
    team_id: Optional[str] = None


class ExpenseResponse(ExpenseBase):
    id: str
    season_id: str
    team_id: Optional[str] = None
    created_by: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Revenue schemas
class RevenueBase(BaseModel):
    category: RevenueCategory
    description: str
    amount: float
    source: Optional[str] = None
    payment_date: date
    notes: Optional[str] = None


class RevenueCreate(RevenueBase):
    season_id: str
    team_id: Optional[str] = None


class RevenueResponse(RevenueBase):
    id: str
    season_id: str
    team_id: Optional[str] = None
    created_by: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Player schemas
class PlayerBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[date] = None
    parent_name: Optional[str] = None
    parent_email: Optional[EmailStr] = None
    parent_phone: Optional[str] = None
    registration_fee_paid: bool = False
    registration_fee_amount: float = 0.0
    registration_date: Optional[date] = None
    jersey_number: Optional[int] = None
    notes: Optional[str] = None


class PlayerCreate(PlayerBase):
    team_id: str


class PlayerResponse(PlayerBase):
    id: str
    team_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# Dashboard/Summary schemas
class BudgetSummary(BaseModel):
    season_id: str
    season_name: str
    total_budgeted: float
    total_expenses: float
    total_revenue: float
    remaining_budget: float
    profit_loss: float


# Quick Expense schemas
class QuickExpenseEntry(BaseModel):
    team_id: str
    amount: float
    description: str
    payment_date: date
    player_count: Optional[int] = None  # For per-player calculations


class BulkRegistrationFeeEntry(BaseModel):
    team_id: str
    player_count: int
    fee_per_player: float
    payment_date: date
    notes: Optional[str] = None


# Financial Transparency schemas
class PlayerCostBreakdown(BaseModel):
    team_id: str
    team_name: str
    total_cost: float
    player_count: int
    cost_per_player: float
    registration_fee: float
    other_costs: float
    breakdown_by_category: dict


class TransparencyReport(BaseModel):
    organization_id: str
    organization_name: str
    season_id: Optional[str] = None
    total_budgeted: float
    total_expenses: float
    total_revenue: float
    expenses_by_category: dict
    revenues_by_category: dict
    player_cost_breakdown: List[PlayerCostBreakdown]
    profit_loss: float


class TeamBudgetSummary(BaseModel):
    team_id: str
    team_name: str
    total_budgeted: float
    total_expenses: float
    total_revenue: float
    remaining_budget: float
    profit_loss: float
    player_count: int
    registration_fees_collected: float
    registration_fees_expected: float
