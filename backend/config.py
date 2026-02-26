from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://openf1:openf1@localhost:5432/openf1"
    REDIS_URL: str = "redis://localhost:6379/0"
    FASTF1_CACHE_DIR: str = "./fastf1_cache"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
