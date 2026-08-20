# This file will combine all our individual API routers (like users, auth, etc.)
from fastapi import APIRouter
from src.api.v1 import auth, users
from src.api.v1.studio.router import router as studio_router

router = APIRouter()

# Express equivalent: v1Router.use('/auth', authRouter)
router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(users.router, prefix="/users", tags=["users"])
router.include_router(studio_router, prefix="/studio", tags=["studio"])
