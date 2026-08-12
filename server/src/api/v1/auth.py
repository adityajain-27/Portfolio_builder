from fastapi import APIRouter

router = APIRouter()

# We will add @router.post("/register") and @router.post("/login") here soon!


@router.post("/register")
async def register():
    