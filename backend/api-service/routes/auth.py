from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import uuid

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Import from shared modules
from database import users_db, companies_db, profiles_db
from auth_utils import hash_password, verify_password, create_access_token, get_current_user

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
    refresh_token: Optional[str] = None

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup):
    if user_data.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    company_id = str(uuid.uuid4())
    companies_db[company_id] = {
        "id": company_id,
        "name": user_data.company_name,
        "plan": "starter",
        "created_at": datetime.utcnow().isoformat()
    }
    
    user_id = str(uuid.uuid4())
    users_db[user_data.email] = {
        "id": user_id,
        "name": user_data.full_name,
        "email": user_data.email,
        "hashed_password": hash_password(user_data.password),
        "role": user_data.role,
        "company_id": company_id,
        "created_at": datetime.utcnow().isoformat()
    }
    
    profiles_db[user_id] = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "full_name": user_data.full_name,
        "email": user_data.email,
        "role": user_data.role,
        "country": user_data.country,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }
    
    return {
        "message": "User created successfully",
        "user_id": user_id,
        "company_id": company_id
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    user = users_db.get(credentials.email)
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token = create_access_token(data={"sub": credentials.email, "user_id": user["id"]})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {"message": "Logged out successfully"}

@router.post("/magic-link")
async def request_magic_link(email: EmailStr):
    return {"message": "Magic link sent to email"}

@router.post("/refresh")
async def refresh_token(refresh_token: str):
    return {"access_token": "new_token", "token_type": "bearer"}

@router.post("/forgot-password")
async def forgot_password(email: EmailStr):
    return {"message": "Password reset link sent to email"}

@router.post("/reset-password")
async def reset_password(token: str, new_password: str):
    return {"message": "Password reset successfully"}

@router.get("/verify")
async def verify_token(current_user: dict = Depends(get_current_user)):
    return {"user_id": current_user["id"], "email": current_user["email"]}

