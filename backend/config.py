import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    jwt_secret_key = os.getenv("jwt_secret_key")
    database_url = os.getenv("database_url", "database.db")
    jwt_access_expires = 900 #15 minutes
    jwt_refresh_expires = 86400 #24 hours