from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

router = APIRouter(prefix="/api/v1/profile", tags=["Profile"])

from database import profiles_db, users_db
from auth_utils import get_current_user, hash_password, verify_password

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    country: Optional[str] = None
    timezone: Optional[str] = None

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

@router.get("")
async def get_profile(current_user: dict = Depends(get_current_user)):
    profile = profiles_db.get(current_user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.put("")
async def update_profile(profile_data: ProfileUpdate, current_user: dict = Depends(get_current_user)):
    profile = profiles_db.get(current_user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    update_data = profile_data.dict(exclude_unset=True)
    profile.update(update_data)
    profile["updated_at"] = datetime.utcnow().isoformat()
    
    return profile

@router.patch("/avatar")
async def update_avatar(avatar_url: str, current_user: dict = Depends(get_current_user)):
    profile = profiles_db.get(current_user["id"])
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile["avatar_url"] = avatar_url
    profile["updated_at"] = datetime.utcnow().isoformat()
    return {"message": "Avatar updated", "avatar_url": avatar_url}

@router.post("/change-password")
async def change_password(password_data: PasswordChange, current_user: dict = Depends(get_current_user)):
    user = users_db.get(current_user["email"])
    if not verify_password(password_data.current_password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Current password incorrect")
    
    user["hashed_password"] = hash_password(password_data.new_password)
    return {"message": "Password changed successfully"}

