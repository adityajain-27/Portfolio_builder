from fastapi import APIRouter
from src.api.v1.studio import gate, generate, resumes

router = APIRouter()

# /gate is intentionally NOT behind require_studio_gate — it's how you obtain the token in the first place.
router.include_router(gate.router, tags=["studio"])
router.include_router(generate.router, tags=["studio"])
router.include_router(resumes.router, tags=["studio"])
