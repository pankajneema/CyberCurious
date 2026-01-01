from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Literal
from sqlalchemy.orm import Session

from utils.database import get_db
from utils.auth_utils import get_current_user
from models.asset_models import Asset as AssetModel

router = APIRouter(prefix="/api/v1/assets", tags=["Assets"])


# -------------------- Schemas --------------------

class AssetResponse(BaseModel):
    id: str
    name: str
    type: str
    exposure: str
    risk_score: int
    tags: List[str]
    status: str
    last_seen: Optional[str]
    description: Optional[str]
    created_at: Optional[str]
    updated_at: Optional[str]


class AssetListResponse(BaseModel):
    items: List[AssetResponse]
    total: int
    page: int
    page_size: int


class AssetCreateRequest(BaseModel):
    name: str
    type: Literal["domain", "ip", "cloud", "repo", "saas", "user"]
    exposure: Literal["public", "internal"] = "internal"
    tags: Optional[List[str]] = None
    description: Optional[str] = None


class AssetUpdateRequest(BaseModel):
    name: Optional[str] = None
    exposure: Optional[Literal["public", "internal"]] = None
    tags: Optional[List[str]] = None
    status: Optional[str] = None
    risk_score: Optional[int] = None
    description: Optional[str] = None


# -------------------- Routes --------------------

@router.get("", response_model=AssetListResponse)
def list_assets(
    q: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    exposure: Optional[str] = Query(None),
    page: int = 1,
    page_size: int = 50,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(AssetModel).filter(
        AssetModel.user_id == current_user["user_id"]
    )

    if q:
        query = query.filter(AssetModel.name.ilike(f"%{q}%"))

    if type:
        query = query.filter(AssetModel.type == type)

    if exposure:
        query = query.filter(AssetModel.exposure == exposure)

    total = query.count()

    assets = (
        query
        .order_by(AssetModel.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return AssetListResponse(
        items=[asset.to_dict() for asset in assets],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=AssetResponse)
def create_asset(
    payload: AssetCreateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    asset = AssetModel(
        user_id=current_user["user_id"],
        name=payload.name,
        type=payload.type,
        exposure=payload.exposure,
        tags=payload.tags or [],
        description=payload.description,
        status="active",
        risk_score=0,
    )

    db.add(asset)
    db.commit()
    db.refresh(asset)

    return asset.to_dict()


@router.get("/{asset_id}", response_model=AssetResponse)
def get_asset(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    asset = (
        db.query(AssetModel)
        .filter(
            AssetModel.id == asset_id,
            AssetModel.user_id == current_user["user_id"],
        )
        .first()
    )

    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    return asset.to_dict()


@router.patch("/{asset_id}", response_model=AssetResponse)
def update_asset(
    asset_id: str,
    payload: AssetUpdateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    asset = (
        db.query(AssetModel)
        .filter(
            AssetModel.id == asset_id,
            AssetModel.user_id == current_user["user_id"],
        )
        .first()
    )

    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    for key, value in payload.dict(exclude_unset=True).items():
        setattr(asset, key, value)

    db.commit()
    db.refresh(asset)

    return asset.to_dict()


@router.delete("/{asset_id}")
def delete_asset(
    asset_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    asset = (
        db.query(AssetModel)
        .filter(
            AssetModel.id == asset_id,
            AssetModel.user_id == current_user["user_id"],
        )
        .first()
    )

    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    db.delete(asset)
    db.commit()

    return {"message": "Asset deleted successfully"}