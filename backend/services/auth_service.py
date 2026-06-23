import bcrypt
import jwt
from datetime import datetime, timedelta
from config import JWT_SECRET, JWT_ALGORITHM, JWT_EXPIRATION_HOURS
from sqlalchemy.orm import Session
from models import User

LOGIN_ATTEMPTS = {}
MAX_ATTEMPTS = 5
LOCKOUT_MINUTES = 15

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

def create_access_token(user_id: int, expires_in: int = 3600) -> str:
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(seconds=expires_in),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_access_token(token: str) -> int | None:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload.get("user_id")
    except (jwt.ExpiredSignatureError, jwt.InvalidTokenError):
        return None

def is_rate_limited(email: str) -> bool:
    if email not in LOGIN_ATTEMPTS:
        return False

    attempts, locked_until = LOGIN_ATTEMPTS[email]

    if datetime.utcnow() < locked_until:
        return True

    if datetime.utcnow() > locked_until + timedelta(minutes=LOCKOUT_MINUTES):
        del LOGIN_ATTEMPTS[email]
        return False

    return False

def record_login_attempt(email: str, success: bool):
    if success:
        if email in LOGIN_ATTEMPTS:
            del LOGIN_ATTEMPTS[email]
        return

    if email not in LOGIN_ATTEMPTS:
        LOGIN_ATTEMPTS[email] = (1, datetime.utcnow())
    else:
        attempts, _ = LOGIN_ATTEMPTS[email]
        attempts += 1

        if attempts >= MAX_ATTEMPTS:
            locked_until = datetime.utcnow() + timedelta(minutes=LOCKOUT_MINUTES)
            LOGIN_ATTEMPTS[email] = (attempts, locked_until)
        else:
            LOGIN_ATTEMPTS[email] = (attempts, datetime.utcnow())

def register_user(db: Session, email: str, password: str) -> User | None:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        return None

    user = User(
        email=email,
        password_hash=hash_password(password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    if is_rate_limited(email):
        return None

    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        record_login_attempt(email, False)
        return None

    record_login_attempt(email, True)
    return user
