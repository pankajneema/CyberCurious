from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import List

router = APIRouter(prefix="/api/v1/accounts", tags=["Accounts"])

from database import companies_db, users_db
from auth_utils import get_current_user

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str
    company_id: str

@router.get("/{account_id}")
async def get_account(account_id: str, current_user: dict = Depends(get_current_user)):
    account = companies_db.get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@router.put("/{account_id}")
async def update_account(account_id: str, account_data: dict, current_user: dict = Depends(get_current_user)):
    account = companies_db.get(account_id)
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    account.update(account_data)
    return account

@router.get("/{account_id}/members", response_model=List[User])
async def list_account_members(account_id: str, current_user: dict = Depends(get_current_user)):
    members = [u for u in users_db.values() if u.get("company_id") == account_id]
    return [User(**m) for m in members]

@router.post("/{account_id}/invite")
async def invite_member(account_id: str, email: EmailStr, role: str = "reader", current_user: dict = Depends(get_current_user)):
    return {"message": "Invitation sent", "email": email, "role": role}

@router.delete("/{account_id}/members/{member_id}")
async def remove_member(account_id: str, member_id: str, current_user: dict = Depends(get_current_user)):
    return {"message": "Member removed successfully"}

