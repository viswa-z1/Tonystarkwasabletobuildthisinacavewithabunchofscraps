from config import config

def build_stt():
    if config.STT_PROVIDER == "google":
        from livekit.plugins import google as lk_google
        return lk_google.STT(api_key=config.GOOGLE_API_KEY)
    elif config.STT_PROVIDER == "sarvam":
        from livekit.plugins import sarvam
        return sarvam.STT(language="unknown", model="saaras:v3", mode="transcribe")
    elif config.STT_PROVIDER == "whisper":
        from livekit.plugins import openai as lk_openai
        return lk_openai.STT(model="whisper-1")
    raise ValueError(f"Unknown STT_PROVIDER: {config.STT_PROVIDER}")

