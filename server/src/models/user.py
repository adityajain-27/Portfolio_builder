from datetime import datetime, timezone
from src.schemas.user import UserCreate
from src.utils.security import get_password_hash

# Since we use Motor directly, we define helper functions to interact with the DB
# This file acts just like your Mongoose Models.

async def create_user(db, user: UserCreate):
    # 1. Convert Pydantic object to a Python dictionary
    user_dict = user.model_dump()
    
    # 2. Hash the password and remove the raw password
    hashed_password = get_password_hash(user_dict.pop("password"))
    user_dict["hashed_password"] = hashed_password
    user_dict["created_at"] = datetime.now(timezone.utc)
    
    # 3. Insert into the 'users' collection (like new User().save())
    result = await db["users"].insert_one(user_dict)
    
    # 4. Fetch the created user and map the MongoDB _id to a readable id string
    created_user = await db["users"].find_one({"_id": result.inserted_id})
    created_user["id"] = str(created_user["_id"]) 
    return created_user

async def get_user_by_email(db, email: str):
    # Like User.findOne({ email: email })
    user = await db["users"].find_one({"email": email})
    if user:
        user["id"] = str(user["_id"])
    return user
