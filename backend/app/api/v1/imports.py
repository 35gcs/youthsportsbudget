from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import insert
from typing import List
import csv
import io
from datetime import datetime
from app.database import get_db
from app.models import Organization, Season, Team, Expense, Revenue, ExpenseCategory, RevenueCategory, SeasonType
from app.schemas import OrganizationCreate, SeasonCreate, TeamCreate, ExpenseCreate, RevenueCreate

router = APIRouter()

# Batch size for bulk inserts (increased for better performance)
BATCH_SIZE = 500


def parse_date(date_str: str) -> datetime.date:
    """Parse date string in various formats"""
    formats = ['%Y-%m-%d', '%m/%d/%Y', '%m-%d-%Y', '%Y/%m/%d']
    for fmt in formats:
        try:
            return datetime.strptime(date_str.strip(), fmt).date()
        except ValueError:
            continue
    raise ValueError(f"Unable to parse date: {date_str}")


@router.post("/organizations", status_code=status.HTTP_201_CREATED)
async def import_organizations(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Import organizations from CSV"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    content_str = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content_str))
    
    created = []
    errors = []
    
    for row_num, row in enumerate(csv_reader, start=2):  # Start at 2 (1 is header)
        try:
            org = Organization(
                name=row.get('name', '').strip(),
                description=row.get('description', '').strip() or None,
                website=row.get('website', '').strip() or None,
                contact_email=row.get('contact_email', '').strip() or None,
                contact_phone=row.get('contact_phone', '').strip() or None,
                is_public=row.get('is_public', 'false').lower() == 'true'
            )
            db.add(org)
            created.append(org.name)
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    if created:
        db.commit()
        for org in created:
            db.refresh(org)
    
    return {
        "message": f"Imported {len(created)} organizations",
        "created": len(created),
        "errors": errors
    }


@router.post("/seasons", status_code=status.HTTP_201_CREATED)
async def import_seasons(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Import seasons from CSV using bulk insert for performance"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    content_str = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content_str))
    
    created = []
    errors = []
    batch = []
    
    for row_num, row in enumerate(csv_reader, start=2):
        try:
            season_type_str = row.get('season_type', '').strip().lower()
            season_type = SeasonType(season_type_str) if season_type_str else SeasonType.FALL
            
            org_id = row.get('organization_id', '').strip() or None
            batch.append({
                'name': row.get('name', '').strip(),
                'season_type': season_type,  # Use enum object, SQLAlchemy will handle conversion
                'year': int(row.get('year', datetime.now().year)),
                'start_date': parse_date(row.get('start_date', '')),
                'end_date': parse_date(row.get('end_date', '')),
                'is_active': row.get('is_active', 'true').lower() == 'true',
                'organization_id': org_id
            })
            created.append(row.get('name', '').strip())
            
            # Commit in batches for better performance
            if len(batch) >= BATCH_SIZE:
                db.execute(insert(Season).values(batch))
                db.commit()
                batch = []
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    # Commit remaining items
    if batch:
        db.execute(insert(Season).values(batch))
        db.commit()
    
    return {
        "message": f"Imported {len(created)} seasons",
        "created": len(created),
        "errors": errors
    }


@router.post("/teams", status_code=status.HTTP_201_CREATED)
async def import_teams(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Import teams from CSV using bulk insert for performance"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    content_str = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content_str))
    
    created = []
    errors = []
    batch = []
    
    for row_num, row in enumerate(csv_reader, start=2):
        try:
            # Verify season exists
            season_id = row.get('season_id', '').strip()
            if not season_id:
                errors.append(f"Row {row_num}: season_id is required")
                continue
            
            batch.append({
                'name': row.get('name', '').strip(),
                'age_group': row.get('age_group', '').strip(),
                'sport': row.get('sport', '').strip(),
                'gender': row.get('gender', '').strip() or None,
                'max_players': int(row.get('max_players', 20)),
                'registration_fee': float(row.get('registration_fee', 0)),
                'season_id': season_id,
                'coach_id': row.get('coach_id', '').strip() or None
            })
            created.append(row.get('name', '').strip())
            
            # Commit in batches for better performance
            if len(batch) >= BATCH_SIZE:
                db.execute(insert(Team).values(batch))
                db.commit()
                batch = []
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    # Commit remaining items
    if batch:
        db.execute(insert(Team).values(batch))
        db.commit()
    
    return {
        "message": f"Imported {len(created)} teams",
        "created": len(created),
        "errors": errors
    }


@router.post("/expenses", status_code=status.HTTP_201_CREATED)
async def import_expenses(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Import expenses from CSV using bulk insert for performance"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    content_str = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content_str))
    
    created = []
    errors = []
    batch = []
    
    for row_num, row in enumerate(csv_reader, start=2):
        try:
            category_str = row.get('category', '').strip().lower()
            try:
                category = ExpenseCategory(category_str)
            except ValueError:
                category = ExpenseCategory.OTHER
            
            batch.append({
                'season_id': row.get('season_id', '').strip(),
                'team_id': row.get('team_id', '').strip() or None,
                'category': category,  # Use enum object, SQLAlchemy will handle conversion
                'description': row.get('description', '').strip(),
                'amount': float(row.get('amount', 0)),
                'vendor': row.get('vendor', '').strip() or None,
                'receipt_number': row.get('receipt_number', '').strip() or None,
                'payment_date': parse_date(row.get('payment_date', '')),
                'notes': row.get('notes', '').strip() or None,
                'created_by': row.get('created_by', '').strip() or "anonymous"  # Match regular create endpoint
            })
            created.append(row.get('description', '').strip())
            
            # Commit in batches for better performance
            if len(batch) >= BATCH_SIZE:
                db.execute(insert(Expense).values(batch))
                db.commit()
                batch = []
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    # Commit remaining items
    if batch:
        db.execute(insert(Expense).values(batch))
        db.commit()
    
    return {
        "message": f"Imported {len(created)} expenses",
        "created": len(created),
        "errors": errors
    }


@router.post("/revenues", status_code=status.HTTP_201_CREATED)
async def import_revenues(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Import revenues from CSV using bulk insert for performance"""
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a CSV"
        )
    
    content = await file.read()
    content_str = content.decode('utf-8')
    csv_reader = csv.DictReader(io.StringIO(content_str))
    
    created = []
    errors = []
    batch = []
    
    for row_num, row in enumerate(csv_reader, start=2):
        try:
            category_str = row.get('category', '').strip().lower()
            try:
                category = RevenueCategory(category_str)
            except ValueError:
                category = RevenueCategory.OTHER
            
            batch.append({
                'season_id': row.get('season_id', '').strip(),
                'team_id': row.get('team_id', '').strip() or None,
                'category': category,  # Use enum object, SQLAlchemy will handle conversion
                'description': row.get('description', '').strip(),
                'amount': float(row.get('amount', 0)),
                'source': row.get('source', '').strip() or None,
                'payment_date': parse_date(row.get('payment_date', '')),
                'notes': row.get('notes', '').strip() or None,
                'created_by': row.get('created_by', '').strip() or "anonymous"  # Match regular create endpoint
            })
            created.append(row.get('description', '').strip())
            
            # Commit in batches for better performance
            if len(batch) >= BATCH_SIZE:
                db.execute(insert(Revenue).values(batch))
                db.commit()
                batch = []
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")
    
    # Commit remaining items
    if batch:
        db.execute(insert(Revenue).values(batch))
        db.commit()
    
    return {
        "message": f"Imported {len(created)} revenues",
        "created": len(created),
        "errors": errors
    }


@router.get("/templates/{entity_type}")
async def get_import_template(entity_type: str):
    """Get CSV template for import"""
    templates = {
        "organizations": "name,description,website,contact_email,contact_phone,is_public\n",
        "seasons": "name,season_type,year,start_date,end_date,is_active,organization_id\n",
        "teams": "name,age_group,sport,gender,max_players,registration_fee,season_id,coach_id\n",
        "expenses": "season_id,team_id,category,description,amount,vendor,receipt_number,payment_date,notes\n",
        "revenues": "season_id,team_id,category,description,amount,source,payment_date,notes\n"
    }
    
    if entity_type not in templates:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template not found for {entity_type}"
        )
    
    from fastapi.responses import Response
    return Response(
        content=templates[entity_type],
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{entity_type}_template.csv"'}
    )
