from pydantic import BaseModel
from datetime import datetime

class UploadResponse(BaseModel):
    video_id: int
    status: str
    duration: float

    class Config:
        from_attributes = True

class VideoMetadata(BaseModel):
    video_id: int
    filename: str
    duration: float
    width: int
    height: int
    created_at: datetime

    class Config:
        from_attributes = True

class VideoListItem(BaseModel):
    video_id: int
    filename: str
    duration: float
    created_at: datetime

    class Config:
        from_attributes = True
