from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.db.session import connect_to_mongo, close_mongo_connection
from src.api.v1.router import router as api_v1_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(title="Resume-Builder-API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Express equivalent: app.use('/api/v1', v1Router)
app.include_router(api_v1_router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/health")
def health():
    return {"status": "ok"}