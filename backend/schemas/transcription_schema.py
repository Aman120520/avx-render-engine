from pydantic import BaseModel

class TranscriptionResponse(BaseModel):
    text: str
    segments: list[dict]

    class Config:
        from_attributes = True

class PeaksResponse(BaseModel):
    peaks: list[dict]

    class Config:
        from_attributes = True
