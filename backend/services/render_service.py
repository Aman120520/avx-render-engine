import asyncio
import threading
from sqlalchemy.orm import Session
from models import RenderJob

RENDER_JOBS = {}

def queue_render(db: Session, video_id: int, preset_id: int, enabled_hooks: list[int]) -> int:
    job = RenderJob(
        video_id=video_id,
        preset_id=preset_id,
        enabled_hooks=enabled_hooks,
        status="queued",
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    submit_to_cloud(job.id)
    return job.id

def get_render_status(db: Session, job_id: int) -> dict:
    job = db.query(RenderJob).filter(RenderJob.id == job_id).first()
    if not job:
        return None

    return {
        "job_id": job.id,
        "status": job.status,
        "progress": 100 if job.status == "completed" else (50 if job.status == "processing" else 0),
        "output_path": job.output_path,
        "error_message": job.error_message,
    }

def submit_to_cloud(job_id: int):
    def mock_cloud_render():
        import time
        time.sleep(2)
        from database import SessionLocal
        db = SessionLocal()
        job = db.query(RenderJob).filter(RenderJob.id == job_id).first()
        if job:
            job.status = "processing"
            db.commit()
            time.sleep(2)
            job.status = "completed"
            job.output_path = f"/renders/output_{job_id}.mp4"
            db.commit()
        db.close()

    thread = threading.Thread(target=mock_cloud_render, daemon=True)
    thread.start()
