from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/v1/scans", tags=["Vulnerability Scanning"])

from auth_utils import get_current_user

# Mock databases
scans_db = {}
results_db = {}

class ScanRequest(BaseModel):
    name: str
    target: str
    scan_type: str = "external"
    frequency: Optional[str] = None

class Vulnerability(BaseModel):
    cve: str
    severity: str
    exploitability_score: float
    description: str
    remediation: str

class ScanResult(BaseModel):
    id: str
    scan_type: str
    target: str
    status: str
    results: List[Vulnerability]
    created_at: str

@router.post("")
async def create_scan(request: ScanRequest, current_user: dict = Depends(get_current_user)):
    scan_id = str(uuid.uuid4())
    scans_db[scan_id] = {
        "id": scan_id,
        "name": request.name,
        "target": request.target,
        "scan_type": request.scan_type,
        "frequency": request.frequency,
        "status": "running",
        "created_at": datetime.utcnow().isoformat()
    }
    # TODO: Queue scan job for background worker
    return {"scan_id": scan_id, "status": "running"}

@router.get("", response_model=List[dict])
async def list_scans(skip: int = 0, limit: int = 100, current_user: dict = Depends(get_current_user)):
    scans = list(scans_db.values())[skip:skip+limit]
    return scans

@router.get("/{scan_id}", response_model=ScanResult)
async def get_scan(scan_id: str, current_user: dict = Depends(get_current_user)):
    scan = scans_db.get(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    if scan_id not in results_db:
        results_db[scan_id] = {
            "id": scan_id,
            "scan_type": scan["scan_type"],
            "target": scan["target"],
            "status": "completed",
            "results": [
                {
                    "cve": "CVE-2024-0001",
                    "severity": "critical",
                    "exploitability_score": 9.8,
                    "description": "Remote code execution vulnerability",
                    "remediation": "Update to version 2.0.1"
                }
            ],
            "created_at": scan["created_at"]
        }
    
    return ScanResult(**results_db[scan_id])

@router.post("/{scan_id}/retest")
async def retest_scan(scan_id: str, current_user: dict = Depends(get_current_user)):
    scan = scans_db.get(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    scan["status"] = "running"
    return {"scan_id": scan_id, "status": "running"}

@router.delete("/{scan_id}")
async def delete_scan(scan_id: str, current_user: dict = Depends(get_current_user)):
    if scan_id not in scans_db:
        raise HTTPException(status_code=404, detail="Scan not found")
    del scans_db[scan_id]
    return {"message": "Scan deleted successfully"}

