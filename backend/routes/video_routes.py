from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Header
from sqlalchemy.orm import Session
from database import get_db
from schemas.video_schema import UploadResponse, VideoMetadata, VideoListItem
from services.video_service import create_video, get_video, get_user_videos
from services.auth_service import decode_access_token
from utils.file_utils import validate_video_file, save_upload_file

router = APIRouter(prefix="/api/videos", tags=["videos"])

def get_current_user_id(authorization: str = Header(None)) -> int:
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing token"
        )
    token = authorization.replace("Bearer ", "")
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    return user_id

@router.post("/upload", response_model=UploadResponse, status_code=201)
async def upload_video(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    is_valid, error = validate_video_file(file)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error,
        )

    file_path = save_upload_file(file, user_id)
    video = create_video(db, user_id, file.filename, file_path)

    return UploadResponse(
        video_id=video.id,
        status="uploaded",
        duration=video.duration_seconds,
    )

@router.get("/{video_id}", response_model=VideoMetadata)
def get_video_endpoint(
    video_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    video = get_video(db, video_id, user_id)
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )
    return VideoMetadata(
        video_id=video.id,
        filename=video.original_filename,
        duration=video.duration_seconds,
        width=video.width,
        height=video.height,
        created_at=video.created_at,
    )

@router.get("", response_model=list[VideoListItem])
def list_videos(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    videos = get_user_videos(db, user_id)
    return [
        VideoListItem(
            video_id=v.id,
            filename=v.original_filename,
            duration=v.duration_seconds,
            created_at=v.created_at,
        )
        for v in videos
    ]
