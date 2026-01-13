from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Organization
from app.schemas import OrganizationCreate, OrganizationResponse

router = APIRouter()


@router.get("/", response_model=List[OrganizationResponse])
async def get_organizations(
    db: Session = Depends(get_db)
):
    """Get all organizations"""
    organizations = db.query(Organization).all()
    return organizations


@router.post("/", response_model=OrganizationResponse, status_code=status.HTTP_201_CREATED)
async def create_organization(
    org_data: OrganizationCreate,
    db: Session = Depends(get_db)
):
    """Create a new organization/club"""
    new_org = Organization(
        name=org_data.name,
        description=org_data.description,
        website=org_data.website,
        contact_email=org_data.contact_email,
        contact_phone=org_data.contact_phone,
        is_public=org_data.is_public
    )
    
    db.add(new_org)
    db.commit()
    db.refresh(new_org)
    
    return new_org


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific organization"""
    org = db.query(Organization).filter(Organization.id == org_id).first()
    if not org:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Organization not found"
        )
    return org
