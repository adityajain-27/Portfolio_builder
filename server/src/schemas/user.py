from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

# Schema for creating a user (e.g., Register)
class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

# Schema for returning user data (This intentionally hides the password!)
class UserResponse(UserBase):
    id: str
    created_at: datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
