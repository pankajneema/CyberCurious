"""
Authentication API 
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
import uuid

from utils.database import get_db
from models.auth_models import User, Company, Profile
from utils.auth_utils import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# Pydantic  Models
class UserSignup(BaseModel):
    company_name: str
    full_name: str
    email: EmailStr
    password: str
    role: str
    country: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    email: str
    user_id: str
    refresh_token: Optional[str] = None

class MessageResponse(BaseModel):
    message: str

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """
    Register a new user with company
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    try:
        # Create company
        company = Company(
            id=str(uuid.uuid4()),
            name=user_data.company_name,
            plan="starter"
        )
        db.add(company)
        db.flush()  # Flush to get company.id
        
        # Create user
        user = User(
            id=str(uuid.uuid4()),
            email=user_data.email,
            name=user_data.full_name,
            hashed_password=hash_password(user_data.password),
            role=user_data.role,
            company_id=company.id
        )
        db.add(user)
        db.flush()  # Flush to get user.id
        
        # Create profile
        profile = Profile(
            id=str(uuid.uuid4()),
            user_id=user.id,
            full_name=user_data.full_name,
            email=user_data.email,
            role=user_data.role,
            country=user_data.country
        )
        db.add(profile)
        
        # Commit all changes
        db.commit()
        db.refresh(user)
        
        return {
            "message": "User created successfully",
            "user_id": user.id,
            "company_id": company.id
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating user: {str(e)}"
        )

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": credentials.email, "user_id": user.id}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "email": user.email,
        "user_id": user.id
    }

@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: dict = Depends(get_current_user)):
    """
    Logout current user
    """
    # In a real implementation, you might invalidate the token here
    # For now, just return success message
    return {"message": "Logged out successfully"}

@router.post("/magic-link", response_model=MessageResponse)
async def request_magic_link(email: EmailStr, db: Session = Depends(get_db)):
    """
    Request a magic link for passwordless login
    """
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # TODO: Generate magic link token and send email
    # For now, just return success message
    return {"message": "Magic link sent to email"}

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    """
    Refresh access token using refresh token
    """
    # TODO: Implement refresh token logic
    return {"access_token": "new_token", "token_type": "bearer"}

@router.post("/forgot-password", response_model=MessageResponse)
async def forgot_password(email: EmailStr, db: Session = Depends(get_db)):
    """
    Request password reset link
    """
    # Check if user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Don't reveal if email exists or not for security
        return {"message": "If the email exists, a password reset link has been sent"}
    
    # TODO: Generate reset token and send email
    return {"message": "Password reset link sent to email"}

@router.post("/reset-password", response_model=MessageResponse)
async def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    """
    Reset password using reset token
    """
    # TODO: Verify token and update password
    # For now, just return success message
    return {"message": "Password reset successfully"}

@router.get("/verify")
async def verify_token(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Verify current access token and return user info
    """
    # Get full user details from database
    user = db.query(User).filter(User.id == current_user["user_id"]).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "valid": True,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role,
            "company_id": user.company_id
        }
    }