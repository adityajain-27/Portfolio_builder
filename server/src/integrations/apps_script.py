import httpx
from src.core.config import settings


class AppsScriptError(Exception):
    pass


async def generate_resume_document(resume_payload: dict) -> dict:
    if not settings.GS_RESUME_URL:
        raise AppsScriptError("GS_RESUME_URL is not configured on the server.")

    try:
        async with httpx.AsyncClient(timeout=30.0, follow_redirects=False) as client:
            # Apps Script's /exec endpoint replies with a 302 to a
            # script.googleusercontent.com/macros/echo?... URL that holds the
            # actual JSON result. That follow-up must be a GET — most HTTP
            # clients (curl included, by default) turn a POST redirect into a
            # GET automatically, but only if they follow the redirect for us.
            # We do it manually here so the intent is explicit either way.
            post_response = await client.post(settings.GS_RESUME_URL, json=resume_payload)
            if post_response.status_code in (301, 302, 303, 307, 308):
                redirect_url = post_response.headers.get("location")
                if not redirect_url:
                    raise AppsScriptError("Resume generator redirected without a location.")
                response = await client.get(redirect_url)
            else:
                response = post_response
    except httpx.HTTPError as exc:
        # Network failure, timeout, DNS issue, etc. — same "don't crash the process" rule
        # the college brief requires for the Gemini call applies here too.
        raise AppsScriptError(f"Could not reach the resume generator: {exc}") from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise AppsScriptError("Resume generator returned an unexpected (non-JSON) response.") from exc

    if not data.get("success"):
        raise AppsScriptError(data.get("error") or "Resume generation failed.")

    return data
