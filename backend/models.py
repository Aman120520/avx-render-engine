from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    videos = relationship("Video", back_populates="user", cascade="all, delete-orphan")
    presets = relationship("VibePreset", back_populates="user", cascade="all, delete-orphan")


class VibePreset(Base):
    __tablename__ = "vibe_presets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    config = Column(JSON, nullable=False)
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="presets")


class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    upload_path = Column(String(512), nullable=False)
    duration_seconds = Column(Float, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="videos")
    transcription = relationship("Transcription", back_populates="video", uselist=False, cascade="all, delete-orphan")
    audio_peaks = relationship("AudioPeaks", back_populates="video", uselist=False, cascade="all, delete-orphan")
    render_jobs = relationship("RenderJob", back_populates="video", cascade="all, delete-orphan")


class Transcription(Base):
    __tablename__ = "transcriptions"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False, unique=True)
    text = Column(String, nullable=True)
    segments = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    video = relationship("Video", back_populates="transcription")


class AudioPeaks(Base):
    __tablename__ = "audio_peaks"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False, unique=True)
    peaks = Column(JSON, nullable=False)
    silence_regions = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    video = relationship("Video", back_populates="audio_peaks")


class RenderJob(Base):
    __tablename__ = "render_jobs"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    preset_id = Column(Integer, ForeignKey("vibe_presets.id"), nullable=False)
    enabled_hooks = Column(JSON, nullable=False)
    status = Column(String(50), default="queued")
    output_path = Column(String(512), nullable=True)
    error_message = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    video = relationship("Video", back_populates="render_jobs")
    preset = relationship("VibePreset")
