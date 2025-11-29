from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1/billing", tags=["Billing"])

from database import companies_db
from auth_utils import get_current_user

# Mock invoices database
invoices_db = {}

class SubscriptionRequest(BaseModel):
    company_id: str
    plan: str  # starter, pro, enterprise
    billing_period: str  # monthly, annual

class Invoice(BaseModel):
    id: str
    company_id: str
    amount: float
    status: str
    created_at: str

@router.get("/plan")
async def get_plan(company_id: str, current_user: dict = Depends(get_current_user)):
    account = companies_db.get(company_id)
    if not account:
        return {"plan": "starter", "status": "trial"}
    return {"plan": account.get("plan", "starter"), "status": "active"}

@router.post("/subscribe")
async def create_subscription(request: SubscriptionRequest, current_user: dict = Depends(get_current_user)):
    account = companies_db.get(request.company_id)
    if account:
        account["plan"] = request.plan
    return {"message": "Subscription created", "plan": request.plan}

@router.get("/invoices", response_model=List[Invoice])
async def list_invoices(company_id: str, current_user: dict = Depends(get_current_user)):
    invoices = [inv for inv in invoices_db.values() if inv["company_id"] == company_id]
    return invoices

@router.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: str, current_user: dict = Depends(get_current_user)):
    invoice = invoices_db.get(invoice_id)
    if not invoice:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Invoice not found")
    return Invoice(**invoice)

@router.post("/payment-method")
async def add_payment_method(payment_data: dict, current_user: dict = Depends(get_current_user)):
    return {"message": "Payment method added", "method_id": str(uuid.uuid4())}

@router.delete("/payment-method/{method_id}")
async def remove_payment_method(method_id: str, current_user: dict = Depends(get_current_user)):
    return {"message": "Payment method removed"}

@router.post("/upgrade")
async def upgrade_plan(plan_data: dict, current_user: dict = Depends(get_current_user)):
    return {"message": "Plan upgraded", "plan": plan_data.get("plan")}

@router.post("/cancel")
async def cancel_subscription(cancel_data: dict, current_user: dict = Depends(get_current_user)):
    return {"message": "Subscription cancelled"}

