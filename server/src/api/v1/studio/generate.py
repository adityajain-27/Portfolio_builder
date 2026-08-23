from fastapi import APIRouter, HTTPException, status
from src.schemas.resume import ResumeData, GenerateResumeResponse
from src.integrations.apps_script import generate_resume_document, AppsScriptError

router = APIRouter()


@router.post(
    "/generate",
    response_model=GenerateResumeResponse,
)
async def generate_resume(resume: ResumeData):
    # Guest flow: nothing is persisted anywhere. The payload goes to the Apps
    # Script, we hand back the links, and this server forgets about it.
    try:
        result = await generate_resume_document(resume.model_dump())
    except AppsScriptError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    return GenerateResumeResponse(
        download_url=result["downloadUrl"],
        google_doc_url=result["googleDocUrl"],
    )