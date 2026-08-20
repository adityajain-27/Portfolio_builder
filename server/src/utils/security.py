from datetime import datetime, timedelta, timezone
import jwt
from passlib.context import CryptContext
from src.core.config import settings

# This sets up bcrypt for password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_minutes: int) -> str:
    # "data" is whatever claims we want baked into the token, e.g. {"scope": "studio_gate"}
    # or {"sub": user_email}. jwt.encode signs it with our secret so it can't be forged.
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expires_minutes)
    to_encode["exp"] = expire
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
    except jwt.PyJWTError:
        # Covers expired tokens, bad signatures, malformed tokens — all treated as "invalid"
        return None
