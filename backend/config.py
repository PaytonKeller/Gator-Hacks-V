import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask-JWT-Extended requires these exact ALL-CAPS names:
    JWT_SECRET_KEY = os.getenv("JWT_key", "fallback-dev-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(seconds=900)    # 15 minutes
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(seconds=86400) # 24 hours
    
    # Custom app config (also ALL-CAPS so app.config loads it)
    DATABASE_URL = os.getenv("database_url", "database.db")
    database_url = DATABASE_URL

    # Meilisearch configuration
    MEILI_URL = os.getenv("MEILI_URL", "http://localhost:7700")
    MEILI_KEY = os.getenv("MEILI_KEY", None)