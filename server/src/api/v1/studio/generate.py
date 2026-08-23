from fastapi import APIRouter, Depends, HTTPException, status
from src.api.deps import require_studio_gate
from src.schemas.resume import ResumeData, GenerateResumeResponse
from src.integrations.apps_script import generate_resume_document, AppsScriptError

router = APIRouter()


@router.post(
    "/generate",
    response_model=GenerateResumeResponse,
    dependencies=[Depends(require_studio_gate)],
)
async def generate_resume(resume: ResumeData):
    # Guest flow: nothing is persisted anywhere on our side. The payload goes
    # to the Apps Script, we hand back the links, and this server forgets
    # about it. _is_guest tells the script to route the Doc/PDF into the
    # guest output folder, which a scheduled trigger sweeps periodically —
    # guest files have no account/DB record, so nothing else can ever clean
    # them up.
    payload = resume.model_dump()
    payload["_is_guest"] = True
    try:
        result = await generate_resume_document(payload)
    except AppsScriptError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    return GenerateResumeResponse(
        download_url=result["downloadUrl"],
        google_doc_url=result["googleDocUrl"],
    )
