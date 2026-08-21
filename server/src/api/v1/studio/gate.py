from fastapi import APIRouter, HTTPException, status
from src.core.config import settings
from src.schemas.studio import StudioGateRequest, StudioGateResponse
from src.utils.security import create_access_token

router = APIRouter()


@router.post("/gate", response_model=StudioGateResponse)
async def check_studio_password(payload: StudioGateRequest):
    if not settings.STUDIO_PASSWORD:
        # Same idea as the brief's "missing API key -> configuration error" case:
        # fail loudly and clearly rather than silently accepting anything.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Studio password is not configured on the server.",
        )

    if payload.password != settings.STUDIO_PASSWORD:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")

    # This token only proves "the gate was passed" — it carries no user identity.
    # It is intentionally separate from the per-user login tokens we'll add later.
    gate_token = create_access_token(
        data={"scope": "studio_gate"},
        expires_minutes=settings.STUDIO_GATE_TOKEN_EXPIRE_MINUTES,
    )
    return StudioGateResponse(gate_token=gate_token)
