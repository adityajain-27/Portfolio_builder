from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from src.db.session import get_db
from src.models.user import get_user_by_email
from src.utils.security import decode_access_token

# HTTPBearer is a FastAPI "security scheme" — it does two things at once:
#   1. Extracts the token from the Authorization: Bearer <token> header for us.
#   2. Registers itself in the OpenAPI schema, which is what makes Swagger UI
#      show a lock icon on protected routes and a working "Authorize" button.
# Reading the header manually (as we did before) skips step 2 entirely.
bearer_scheme = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db=Depends(get_db),
) -> dict:
    """
    Express equivalent: auth middleware that decodes a JWT from the
    Authorization header, loads req.user from the DB, and calls next().
    Here, any route that needs to know WHO is calling just declares:
        current_user: dict = Depends(get_current_user)
    and gets the user dict back directly as a parameter — no req.user mutation.
    """
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials"
    )

    payload = decode_access_token(credentials.credentials)
    if not payload or "sub" not in payload:
        raise credentials_error

    user = await get_user_by_email(db, payload["sub"])
    if not user:
        raise credentials_error

    return user


async def require_studio_gate(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> None:
    """
    Express equivalent: a middleware like
        function requireGate(req, res, next) {
          const token = req.headers.authorization?.split(' ')[1]
          if (!token || !verify(token)) return res.status(401).json(...)
          next()
        }
    In FastAPI, any route that needs this check just adds:
        Depends(require_studio_gate)
    as a parameter — no app.use()/router.use() wiring needed, it's explicit per-route.
    """
    payload = decode_access_token(credentials.credentials)

    if not payload or payload.get("scope") != "studio_gate":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired studio gate token")
