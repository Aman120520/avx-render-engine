import os
import uuid
import subprocess
from pathlib import Path
from fastapi import UploadFile
from config import MAX_UPLOAD_SIZE

UPLOAD_DIR = Path("uploads")

def validate_video_file(file: UploadFile) -> tuple[bool, str | None]:
    if not file.content_type or not file.content_type.startswith("video/"):
        return (False, f"Invalid file type: {file.content_type}. Must be a video file.")

    if file.size and file.size > MAX_UPLOAD_SIZE:
        return (False, f"File too large: {file.size / 1024 / 1024:.1f}MB. Max: 500MB.")

    return (True, None)

def save_upload_file(file: UploadFile, user_id: int) -> str:
    user_dir = UPLOAD_DIR / str(user_id)
    user_dir.mkdir(parents=True, exist_ok=True)

    file_extension = Path(file.filename).suffix
    random_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = user_dir / random_filename

    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())

    return str(file_path)

def get_video_duration(filepath: str) -> float:
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v", "error",
                "-show_entries", "format=duration",
                "-of", "default=noprint_wrappers=1:nokey=1:noinvert_match=0",
                filepath,
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )
        return float(result.stdout.strip())
    except Exception:
        return 0.0

def get_video_dimensions(filepath: str) -> tuple[int, int]:
    try:
        result = subprocess.run(
            [
                "ffprobe",
                "-v", "error",
                "-select_streams", "v:0",
                "-show_entries", "stream=width,height",
                "-of", "csv=s=x:p=0",
                filepath,
            ],
            capture_output=True,
            text=True,
            timeout=10,
        )
        width, height = map(int, result.stdout.strip().split("x"))
        return (width, height)
    except Exception:
        return (0, 0)
