import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SERVER_NAME: str = "FRIDAY"
    MCP_SERVER_PORT: int = int(os.getenv("MCP_SERVER_PORT", "8000"))
    GATEWAY_URL: str = os.getenv("GATEWAY_URL", "http://gateway:8080")
    GATEWAY_INTERNAL_SECRET: str = os.getenv("GATEWAY_INTERNAL_SECRET", "change_me")
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    OPENWEATHERMAP_API_KEY: str = os.getenv("OPENWEATHERMAP_API_KEY", "")
    ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

config = Config()

