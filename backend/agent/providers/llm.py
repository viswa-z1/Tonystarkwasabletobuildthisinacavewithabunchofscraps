from config import config

def build_llm():
    if config.LLM_PROVIDER == "gemini":
        from livekit.plugins import google as lk_google
        return lk_google.LLM(model=config.GEMINI_MODEL, api_key=config.GOOGLE_API_KEY)
    elif config.LLM_PROVIDER == "openai":
        from livekit.plugins import openai as lk_openai
        return lk_openai.LLM(model=config.OPENAI_LLM_MODEL)
    raise ValueError(f"Unknown LLM_PROVIDER: {config.LLM_PROVIDER}")

