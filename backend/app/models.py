from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, Text, Date, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid
import enum


def generate_uuid():
    return str(uuid.uuid4())


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    COACH = "coach"
    VIEWER = "viewer"


class SeasonType(str, enum.Enum):
    SPRING = "spring"
    SUMMER = "summer"
    FALL = "fall"
    WINTER = "winter"


class ExpenseCategory(str, enum.Enum):
    EQUIPMENT = "equipment"
    UNIFORMS = "uniforms"
    FIELD_RENTAL = "field_rental"
    REFEREE_FEES = "referee_fees"
    COACHING_STIPENDS = "coaching_stipends"
    TRAVEL = "travel"
    TOURNAMENT_FEES = "tournament_fees"
    INSURANCE = "insurance"
    FIRST_AID = "first_aid"
    AWARDS = "awards"
    MARKETING = "marketing"
    ADMINISTRATION = "administration"
    OTHER = "other"


class RevenueCategory(str, enum.Enum):
    REGISTRATION_FEES = "registration_fees"
    SPONSORSHIPS = "sponsorships"
    FUNDRAISERS = "fundraisers"
    CONCESSIONS = "concessions"
    MERCHANDISE = "merchandise"
    DONATIONS = "donations"
    OTHER = "other"


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    website = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_phone = Column(String, nullable=True)
    is_public = Column(Boolean, default=False)  # Public financial transparency
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    seasons = relationship("Season", back_populates="organization", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.VIEWER)
    phone_number = Column(String, nullable=True)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    organization = relationship("Organization")
    teams = relationship("Team", back_populates="coach", foreign_keys="Team.coach_id")
    expenses = relationship("Expense", back_populates="created_by_user")
    revenues = relationship("Revenue", back_populates="created_by_user")


class Season(Base):
    __tablename__ = "seasons"

    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    name = Column(String, nullable=False)  # e.g., "Spring 2024"
    season_type = Column(SQLEnum(SeasonType), nullable=False)
    year = Column(Integer, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    organization = relationship("Organization", back_populates="seasons")
    teams = relationship("Team", back_populates="season", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="season", cascade="all, delete-orphan")


class Team(Base):
    __tablename__ = "teams"

    id = Column(String, primary_key=True, default=generate_uuid)
    season_id = Column(String, ForeignKey("seasons.id"), nullable=False)
    name = Column(String, nullable=False)  # e.g., "U10 Boys Soccer"
    age_group = Column(String, nullable=False)  # e.g., "U10", "U12", "U14"
    sport = Column(String, nullable=False)  # e.g., "Soccer", "Basketball", "Baseball"
    gender = Column(String, nullable=True)  # "boys", "girls", "coed"
    coach_id = Column(String, ForeignKey("users.id"), nullable=True)
    max_players = Column(Integer, default=20)
    current_players = Column(Integer, default=0)
    registration_fee = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    season = relationship("Season", back_populates="teams")
    coach = relationship("User", foreign_keys=[coach_id], back_populates="teams")
    budgets = relationship("Budget", back_populates="team", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="team", cascade="all, delete-orphan")
    revenues = relationship("Revenue", back_populates="team", cascade="all, delete-orphan")
    players = relationship("Player", back_populates="team", cascade="all, delete-orphan")


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(String, primary_key=True, default=generate_uuid)
    season_id = Column(String, ForeignKey("seasons.id"), nullable=False)
    team_id = Column(String, ForeignKey("teams.id"), nullable=True)  # Null for season-wide budget
    category = Column(String, nullable=False)  # Expense category or "total"
    budgeted_amount = Column(Float, nullable=False, default=0.0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    season = relationship("Season", back_populates="budgets")
    team = relationship("Team", back_populates="budgets")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(String, primary_key=True, default=generate_uuid)
    season_id = Column(String, ForeignKey("seasons.id"), nullable=False)
    team_id = Column(String, ForeignKey("teams.id"), nullable=True)  # Null for season-wide expenses
    category = Column(SQLEnum(ExpenseCategory), nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    vendor = Column(String, nullable=True)
    receipt_number = Column(String, nullable=True)
    payment_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    season = relationship("Season")
    team = relationship("Team", back_populates="expenses")
    created_by_user = relationship("User", back_populates="expenses")


class Revenue(Base):
    __tablename__ = "revenues"

    id = Column(String, primary_key=True, default=generate_uuid)
    season_id = Column(String, ForeignKey("seasons.id"), nullable=False)
    team_id = Column(String, ForeignKey("teams.id"), nullable=True)  # Null for season-wide revenue
    category = Column(SQLEnum(RevenueCategory), nullable=False)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    source = Column(String, nullable=True)  # Sponsor name, fundraiser name, etc.
    payment_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    season = relationship("Season")
    team = relationship("Team", back_populates="revenues")
    created_by_user = relationship("User", back_populates="revenues")


class Player(Base):
    __tablename__ = "players"

    id = Column(String, primary_key=True, default=generate_uuid)
    team_id = Column(String, ForeignKey("teams.id"), nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    date_of_birth = Column(Date, nullable=True)
    parent_name = Column(String, nullable=True)
    parent_email = Column(String, nullable=True)
    parent_phone = Column(String, nullable=True)
    registration_fee_paid = Column(Boolean, default=False)
    registration_fee_amount = Column(Float, default=0.0)
    registration_date = Column(Date, nullable=True)
    jersey_number = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    team = relationship("Team", back_populates="players")


class QuickExpenseTemplate(Base):
    __tablename__ = "quick_expense_templates"

    id = Column(String, primary_key=True, default=generate_uuid)
    organization_id = Column(String, ForeignKey("organizations.id"), nullable=True)
    name = Column(String, nullable=False)  # e.g., "Registration Fee", "Uniform Purchase"
    category = Column(SQLEnum(ExpenseCategory), nullable=False)
    default_amount = Column(Float, nullable=True)
    description_template = Column(String, nullable=True)
    is_common = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    organization = relationship("Organization")
