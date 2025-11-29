from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1/asm", tags=["ASM"])

from auth_utils import get_current_user

# Mock databases
jobs_db = {}
assets_db = {}

class DiscoveryRequest(BaseModel):
    target: str
    scan_type: str = "external"

class Asset(BaseModel):
    id: str
    type: str
    identifier: str
    first_seen: str
    last_seen: str
    risk_score: int
    tags: List[str]

@router.post("/discover")
async def start_discovery(request: DiscoveryRequest, current_user: dict = Depends(get_current_user)):
    job_id = str(uuid.uuid4())
    jobs_db[job_id] = {
        "id": job_id,
        "target": request.target,
        "scan_type": request.scan_type,
        "status": "running",
        "progress": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    # TODO: Queue job for background worker
    return {"job_id": job_id, "status": "running"}

@router.get("/jobs/{job_id}")
async def get_job_status(job_id: str, current_user: dict = Depends(get_current_user)):
    job = jobs_db.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/assets", response_model=List[Asset])
async def list_assets(skip: int = 0, limit: int = 100, current_user: dict = Depends(get_current_user)):
    if not assets_db:
        assets_db["1"] = {
            "id": "1",
            "type": "domain",
            "identifier": "api.example.com",
            "first_seen": "2024-01-01T00:00:00",
            "last_seen": "2024-01-14T00:00:00",
            "risk_score": 95,
            "tags": ["production", "api"]
        }
    assets = list(assets_db.values())[skip:skip+limit]
    return [Asset(**a) for a in assets]

@router.get("/assets/{asset_id}", response_model=Asset)
async def get_asset(asset_id: str, current_user: dict = Depends(get_current_user)):
    asset = assets_db.get(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return Asset(**asset)

@router.delete("/assets/{asset_id}")
async def delete_asset(asset_id: str, current_user: dict = Depends(get_current_user)):
    if asset_id not in assets_db:
        raise HTTPException(status_code=404, detail="Asset not found")
    del assets_db[asset_id]
    return {"message": "Asset deleted successfully"}

