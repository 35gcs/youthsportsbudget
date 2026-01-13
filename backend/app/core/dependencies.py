from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models import User, UserRole
from app.core.security import decode_access_token

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user from JWT token - optional for now"""
    if credentials:
        try:
            token = credentials.credentials
            user_id = decode_access_token(token)
            
            if user_id:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    return user
        except:
            pass
    
    # Return a dummy user for unauthenticated access
    return User(
        id="anonymous",
        email="anonymous@example.com",
        full_name="Anonymous User",
        hashed_password="",
        role=UserRole.ADMIN  # Give admin access for now
    )


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require admin role - disabled for now"""
    return current_user


def require_coach_or_admin(current_user: User = Depends(get_current_user)) -> User:
    """Require coach or admin role - disabled for now"""
    return current_user
