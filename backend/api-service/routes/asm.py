# api/asm.py

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Literal
from sqlalchemy.orm import Session

from utils.database import get_db
from utils.auth_utils import get_current_user
from models.asm_models import (
    AsmDiscovery as AsmDiscoveryModel,
    AsmDiscoveryRun as AsmDiscoveryRunModel,
)

router = APIRouter(prefix="/api/v1/asm", tags=["ASM"])


# -------------------- Schemas --------------------

class AsmDiscoveryCreateRequest(BaseModel):
    name: str
    asset_type: Literal["domain", "cloud", "saas"]
    target_source: Literal["FROM_ASSET", "MANUAL_ENTRY"]
    asset_ids: Optional[List[str]] = None
    manual_targets: Optional[List[str]] = None

    intensity: Literal["LIGHT", "NORMAL", "DEEP"] = "NORMAL"

    schedule_type: Literal["QUICK", "INTERVAL", "CRON"] = "QUICK"
    schedule_value: Optional[str] = None


class AsmDiscoveryUpdateRequest(BaseModel):
    name: Optional[str] = None
    intensity: Optional[Literal["LIGHT", "NORMAL", "DEEP"]] = None
    schedule_type: Optional[Literal["QUICK", "INTERVAL", "CRON"]] = None
    schedule_value: Optional[str] = None
    status: Optional[Literal["ACTIVE", "PAUSED"]] = None


class AsmDiscoveryResponse(BaseModel):
    id: str
    name: str
    asset_type: str
    intensity: str

    schedule_type: str
    schedule_value: Optional[str]

    status: str
    last_run_at: Optional[str]
    next_run_at: Optional[str]

    created_at: Optional[str]
    updated_at: Optional[str]


class AsmDiscoveryListResponse(BaseModel):
    items: List[AsmDiscoveryResponse]
    total: int
    page: int
    page_size: int


class AsmDashboardResponse(BaseModel):
    attack_surface_score: int
    total_discoveries: int
    active_discoveries: int
    last_discovery_run: Optional[str]


# -------------------- Routes --------------------

@router.post("/discoveries", response_model=AsmDiscoveryResponse)
def create_discovery(
    payload: AsmDiscoveryCreateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):

    discovery = AsmDiscoveryModel(
        user_id=current_user["user_id"],
        name=payload.name,
        asset_type=payload.asset_type,
        target_source=payload.target_source,
        asset_ids=payload.asset_ids,
        manual_targets=payload.manual_targets,
        intensity=payload.intensity,
        schedule_type=payload.schedule_type,
        schedule_value=payload.schedule_value,
        status="PENDING",
    )

    db.add(discovery)
    db.commit()
    db.refresh(discovery)

    return discovery.to_dict()


@router.get("/discoveries", response_model=AsmDiscoveryListResponse)
def list_discoveries(
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(AsmDiscoveryModel).filter(
        AsmDiscoveryModel.user_id == current_user["user_id"]
    )

    total = query.count()

    discoveries = (
        query
        .order_by(AsmDiscoveryModel.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return AsmDiscoveryListResponse(
        items=[d.to_dict() for d in discoveries],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.patch("/discoveries/{discovery_id}", response_model=AsmDiscoveryResponse)
def update_discovery(
    discovery_id: str,
    payload: AsmDiscoveryUpdateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    discovery = (
        db.query(AsmDiscoveryModel)
        .filter(
            AsmDiscoveryModel.id == discovery_id,
            AsmDiscoveryModel.user_id == current_user["user_id"],
        )
        .first()
    )

    if not discovery:
        raise HTTPException(status_code=404, detail="Discovery not found")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(discovery, key, value)

    db.commit()
    db.refresh(discovery)

    return discovery.to_dict()


@router.get("/dashboard", response_model=AsmDashboardResponse)
def asm_dashboard(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    total = db.query(AsmDiscoveryModel).filter(
        AsmDiscoveryModel.user_id == current_user["user_id"]
    ).count()

    active = db.query(AsmDiscoveryModel).filter(
        AsmDiscoveryModel.user_id == current_user["user_id"],
        AsmDiscoveryModel.status == "ACTIVE",
    ).count()

    last_run = (
        db.query(AsmDiscoveryRunModel)
        .filter(AsmDiscoveryRunModel.user_id == current_user["user_id"])
        .order_by(AsmDiscoveryRunModel.started_at.desc())
        .first()
    )

    return AsmDashboardResponse(
        attack_surface_score=75,
        total_discoveries=total,
        active_discoveries=active,
        last_discovery_run=last_run.started_at if last_run else None,
    )
