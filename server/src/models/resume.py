from datetime import datetime, timezone
from bson import ObjectId

# Same raw-Motor-dict style as src/models/user.py — no ODM.


async def create_saved_resume(db, user_id: str, resume_data: dict, google_doc_url: str, download_url: str) -> dict:
    doc = {
        "user_id": ObjectId(user_id),
        "data": resume_data,
        "google_doc_url": google_doc_url,
        "download_url": download_url,
        "created_at": datetime.now(timezone.utc),
    }
    result = await db["saved_resumes"].insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return doc


async def list_saved_resumes_for_user(db, user_id: str) -> list[dict]:
    cursor = db["saved_resumes"].find({"user_id": ObjectId(user_id)}).sort("created_at", -1)
    resumes = await cursor.to_list(length=100)
    for resume in resumes:
        resume["id"] = str(resume["_id"])
    return resumes


async def get_saved_resume_by_id(db, resume_id: str, user_id: str) -> dict | None:
    # Scoped by user_id too, so one user can never fetch another user's resume by guessing an id.
    resume = await db["saved_resumes"].find_one({"_id": ObjectId(resume_id), "user_id": ObjectId(user_id)})
    if resume:
        resume["id"] = str(resume["_id"])
    return resume
