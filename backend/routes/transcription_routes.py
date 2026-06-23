from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from database import get_db
from models import Video, Transcription, AudioPeaks
from services.auth_service import decode_access_token
from services.transcription_service import transcribe_video
from services.audio_service import detect_peaks
from schemas.transcription_schema import TranscriptionResponse, PeaksResponse

router = APIRouter(prefix="/api", tags=["transcription"])

def get_current_user_id(authorization: str = Header(None)) -> int:
    if not authorization:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing token")
    token = authorization.replace("Bearer ", "")
    user_id = decode_access_token(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    return user_id

@router.post("/videos/{video_id}/transcribe", status_code=200)
def transcribe_endpoint(
    video_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    video = db.query(Video).filter(Video.id == video_id, Video.user_id == user_id).first()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    existing_transcription = db.query(Transcription).filter(Transcription.video_id == video_id).first()
    if existing_transcription:
        return {"status": "already_transcribed", "video_id": video_id}

    try:
        transcription_data = transcribe_video(video.upload_path)

        transcription = Transcription(
            video_id=video_id,
            text=transcription_data["text"],
            segments=transcription_data["segments"],
        )
        db.add(transcription)

        peaks_data = detect_peaks(video.upload_path)
        audio_peaks = AudioPeaks(
            video_id=video_id,
            peaks=peaks_data["peaks"],
        )
        db.add(audio_peaks)
        db.commit()

        return {"status": "completed", "video_id": video_id}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Transcription failed: {str(e)}"
        )

@router.get("/videos/{video_id}/transcription", response_model=TranscriptionResponse)
def get_transcription(
    video_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    video = db.query(Video).filter(Video.id == video_id, Video.user_id == user_id).first()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    transcription = db.query(Transcription).filter(Transcription.video_id == video_id).first()
    if not transcription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transcription not found")

    return TranscriptionResponse(text=transcription.text, segments=transcription.segments)

@router.get("/hooks/{video_id}", response_model=PeaksResponse)
def get_peaks(
    video_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user_id),
):
    video = db.query(Video).filter(Video.id == video_id, Video.user_id == user_id).first()
    if not video:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found")

    audio_peaks = db.query(AudioPeaks).filter(AudioPeaks.video_id == video_id).first()
    if not audio_peaks:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Peaks not found")

    return PeaksResponse(peaks=audio_peaks.peaks)
