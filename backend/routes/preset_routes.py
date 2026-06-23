from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from database import get_db
from schemas.preset_schema import PresetCreate, PresetUpdate, PresetResponse
from services.preset_service import (
    create_preset, get_presets, get_preset, update_preset, delete_preset
)
from services.auth_service import decode_access_token

router = APIRouter(prefix="/api/presets", tags=["presets"])

def get_current_user_id(authorization: str = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = authorization.replace("Bearer ", "")
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user_id

@router.get("", response_model=list[PresetResponse])
def list_presets(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    return get_presets(db, user_id)

@router.post("", response_model=PresetResponse, status_code=201)
def create_new_preset(
    request: PresetCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    preset_id = create_preset(db, user_id, request.name, request.config.dict())
    preset = get_preset(db, preset_id, user_id)
    return PresetResponse(**preset)

@router.put("/{preset_id}", response_model=PresetResponse)
def update_existing_preset(
    preset_id: int,
    request: PresetUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    success = update_preset(
        db, preset_id, user_id,
        request.name, request.config.dict() if request.config else None
    )
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Preset not found")
    preset = get_preset(db, preset_id, user_id)
    return PresetResponse(**preset)

@router.delete("/{preset_id}", status_code=204)
def delete_existing_preset(
    preset_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    success = delete_preset(db, preset_id, user_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Preset not found")
