from fastapi import APIRouter, Depends, HTTPException
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/users", tags=["Users"])

from database import users_db
from auth_utils import get_current_user

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str
    company_id: str

@router.get("/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return User(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        company_id=current_user["company_id"]
    )

@router.get("", response_model=List[User])
async def list_users(skip: int = 0, limit: int = 100, current_user: dict = Depends(get_current_user)):
    users = list(users_db.values())[skip:skip+limit]
    return [User(**u) for u in users]

@router.get("/{user_id}", response_model=User)
async def get_user(user_id: str, current_user: dict = Depends(get_current_user)):
    user = next((u for u in users_db.values() if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

@router.put("/{user_id}", response_model=User)
async def update_user(user_id: str, user_data: dict, current_user: dict = Depends(get_current_user)):
    user = next((u for u in users_db.values() if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.update(user_data)
    return User(**user)

@router.delete("/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_user)):
    user = next((u for u in users_db.values() if u["id"] == user_id), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    del users_db[user["email"]]
    return {"message": "User deleted successfully"}

