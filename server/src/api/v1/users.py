# This file will contain our User API endpoints (e.g., GET /users, POST /users)
from fastapi import APIRouter, Depends
from src.api.deps import get_current_user
from src.schemas.user import UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    # current_user is already the full Mongo document (with "id" mapped in get_user_by_email).
    # This is what the frontend calls right after login/register to get the *real*
    # full_name instead of guessing it from the email or a form field.
    return current_user
