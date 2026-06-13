import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "google")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    TTS_PROVIDER: str = os.getenv("TTS_PROVIDER", "google")
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GOOGLE_TTS_VOICE: str = "en-US-Journey-F"
    OPENAI_LLM_MODEL: str = "gpt-4o"
    OPENAI_TTS_MODEL: str = "tts-1"
    OPENAI_TTS_VOICE: str = "nova"
    TTS_SPEED: float = 1.15
    TURN_DETECTION: str = "stt"
    ENDPOINTING_DELAY: float = 0.07
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")

config = Config()

