from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from database import get_db
from schemas.preset_schema import RenderRequest, RenderStatusResponse
from services.render_service import queue_render, get_render_status
from services.auth_service import decode_access_token
from models import Video, RenderJob

router = APIRouter(prefix="/api/render", tags=["render"])

def get_current_user_id(authorization: str = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = authorization.replace("Bearer ", "")
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user_id

@router.post("/{video_id}", response_model=RenderStatusResponse, status_code=202)
def start_render(
    video_id: int,
    request: RenderRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    video = db.query(Video).filter(Video.id == video_id, Video.user_id == user_id).first()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    job_id = queue_render(db, video_id, request.preset_id, request.enabled_hooks)
    status = get_render_status(db, job_id)
    return RenderStatusResponse(**status)

@router.get("/{job_id}/status", response_model=RenderStatusResponse)
def render_status(
    job_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    job = db.query(RenderJob).filter(RenderJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    video = db.query(Video).filter(Video.id == job.video_id, Video.user_id == user_id).first()
    if not video:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized")

    status = get_render_status(db, job_id)
    return RenderStatusResponse(**status)
