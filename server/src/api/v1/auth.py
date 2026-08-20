from fastapi import APIRouter, Depends, HTTPException, status
from src.core.config import settings
from src.db.session import get_db
from src.schemas.user import UserCreate, UserResponse, LoginRequest, Token
from src.models.user import create_user, get_user_by_email
from src.utils.security import verify_password, create_access_token

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db=Depends(get_db)):
    existing_user = await get_user_by_email(db, user.email)
    if existing_user:
        # Express equivalent: res.status(400).json({ error: "..." })
        # In FastAPI you raise an exception instead of building the response yourself.
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    created_user = await create_user(db, user)
    return created_user


@router.post("/login", response_model=Token)
async def login(payload: LoginRequest, db=Depends(get_db)):
    user = await get_user_by_email(db, payload.email)

    # Deliberately return the same error whether the email doesn't exist or the
    # password is wrong — don't let this endpoint reveal which emails are registered.
    invalid_credentials = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password"
    )
    if not user:
        raise invalid_credentials
    if not verify_password(payload.password, user["hashed_password"]):
        raise invalid_credentials

    access_token = create_access_token(
        data={"sub": user["email"]},
        expires_minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES,
    )
    return Token(access_token=access_token)
