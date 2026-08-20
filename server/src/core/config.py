from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Resume-Builder-API"
    MONGO_URI: str = "mongodb://localhost:27017" # Default local MongoDB URL

    GS_RESUME_URL: str = ""  # Deployed Google Apps Script /exec URL for resume generation

    # Studio gate: a single shared password unlocks the hidden resume-studio
    # area (before any per-user login). Separate from per-user auth below.
    STUDIO_PASSWORD: str = ""
    STUDIO_GATE_TOKEN_EXPIRE_MINUTES: int = 120

    JWT_SECRET_KEY: str = ""
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
