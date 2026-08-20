from pydantic import BaseModel


class StudioGateRequest(BaseModel):
    password: str


class StudioGateResponse(BaseModel):
    gate_token: str
    token_type: str = "bearer"
