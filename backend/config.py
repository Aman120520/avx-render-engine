import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./avx.db")
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 1

WHISPER_API_KEY = os.getenv("WHISPER_API_KEY")
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")

MAX_UPLOAD_SIZE = 500 * 1024 * 1024  # 500MB
