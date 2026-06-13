from config import config

def build_tts():
    if config.TTS_PROVIDER == "google":
        from livekit.plugins import google as lk_google
        return lk_google.TTS(
            voice=config.GOOGLE_TTS_VOICE,
            api_key=config.GOOGLE_API_KEY,
        )
    elif config.TTS_PROVIDER == "openai":
        from livekit.plugins import openai as lk_openai
        return lk_openai.TTS(
            model=config.OPENAI_TTS_MODEL,
            voice=config.OPENAI_TTS_VOICE,
            speed=config.TTS_SPEED,
        )
    elif config.TTS_PROVIDER == "sarvam":
        from livekit.plugins import sarvam
        return sarvam.TTS(target_language_code="en-IN", model="bulbul:v3", speaker="rahul")
    raise ValueError(f"Unknown TTS_PROVIDER: {config.TTS_PROVIDER}")

