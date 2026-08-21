from fastapi import APIRouter, Depends, HTTPException, status
from src.api.deps import get_current_user
from src.db.session import get_db
from src.schemas.resume import ResumeData, GenerateResumeResponse
from src.integrations.apps_script import generate_resume_document, AppsScriptError
from src.models.resume import (
    create_saved_resume,
    list_saved_resumes_for_user,
    get_saved_resume_by_id,
    update_saved_resume,
    delete_saved_resume,
)

router = APIRouter()


@router.post("/resumes/generate", response_model=GenerateResumeResponse)
async def generate_and_save_resume(
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    # Logged-in flow: same Apps Script call as the guest /studio/generate route,
    # but the result gets saved so it shows up on this user's dashboard.
    try:
        result = await generate_resume_document(resume.model_dump())
    except AppsScriptError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    await create_saved_resume(
        db,
        user_id=current_user["id"],
        resume_data=resume.model_dump(),
        google_doc_url=result["googleDocUrl"],
        download_url=result["downloadUrl"],
    )

    return GenerateResumeResponse(
        download_url=result["downloadUrl"],
        google_doc_url=result["googleDocUrl"],
    )


@router.get("/resumes")
async def list_my_resumes(current_user: dict = Depends(get_current_user), db=Depends(get_db)):
    resumes = await list_saved_resumes_for_user(db, user_id=current_user["id"])
    return [
        {
            "id": r["id"],
            "full_name": r["data"].get("full_name"),
            "google_doc_url": r["google_doc_url"],
            "download_url": r["download_url"],
            "created_at": r["created_at"],
        }
        for r in resumes
    ]


@router.get("/resumes/{resume_id}")
async def get_my_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    resume = await get_saved_resume_by_id(db, resume_id=resume_id, user_id=current_user["id"])
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


@router.put("/resumes/{resume_id}", response_model=GenerateResumeResponse)
async def update_my_resume(
    resume_id: str,
    resume: ResumeData,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    # Editing an existing resume regenerates the document (content changed) but
    # updates the SAME saved_resumes row in place — no more duplicate entries
    # piling up on the dashboard every time someone re-saves an edit.
    try:
        result = await generate_resume_document(resume.model_dump())
    except AppsScriptError as exc:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=str(exc)) from exc

    updated = await update_saved_resume(
        db,
        resume_id=resume_id,
        user_id=current_user["id"],
        resume_data=resume.model_dump(),
        google_doc_url=result["googleDocUrl"],
        download_url=result["downloadUrl"],
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    return GenerateResumeResponse(
        download_url=result["downloadUrl"],
        google_doc_url=result["googleDocUrl"],
    )


@router.delete("/resumes/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_my_resume(
    resume_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db),
):
    deleted = await delete_saved_resume(db, resume_id=resume_id, user_id=current_user["id"])
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
