from sqlalchemy.orm import Session
from models import Video
from utils.file_utils import get_video_duration, get_video_dimensions

def create_video(
    db: Session,
    user_id: int,
    original_filename: str,
    upload_path: str,
) -> Video:
    duration = get_video_duration(upload_path)
    width, height = get_video_dimensions(upload_path)

    video = Video(
        user_id=user_id,
        original_filename=original_filename,
        upload_path=upload_path,
        duration_seconds=duration,
        width=width,
        height=height,
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video

def get_video(db: Session, video_id: int, user_id: int) -> Video | None:
    return db.query(Video).filter(
        Video.id == video_id,
        Video.user_id == user_id,
    ).first()

def get_user_videos(db: Session, user_id: int) -> list[Video]:
    return db.query(Video).filter(Video.user_id == user_id).order_by(Video.created_at.desc()).all()
