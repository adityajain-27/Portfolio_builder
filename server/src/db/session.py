from motor.motor_asyncio import AsyncIOMotorClient
from src.core.config import settings

class Database:
    client: AsyncIOMotorClient = None

db = Database()

async def connect_to_mongo():
    db.client = AsyncIOMotorClient(settings.MONGO_URI)
    print("Connected to MongoDB!")

async def close_mongo_connection():
    if db.client:
        db.client.close()
        print("Closed MongoDB connection!")

# Dependency to get the database instance in our routes
def get_db():
    # Replace 'skillcred_db' with your preferred database name
    return db.client["skillcred_db"]
