"""Provider factory smoke tests"""
import os, pytest

def test_config_loads():
    from config import config
    assert config.STT_PROVIDER in ("sarvam", "whisper")
    assert config.LLM_PROVIDER in ("gemini", "openai")
    assert config.TTS_PROVIDER in ("openai", "sarvam")

