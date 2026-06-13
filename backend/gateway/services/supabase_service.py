"""Supabase DB operations"""
from supabase import create_client
from config import settings

_client = None

def get_client():
    global _client
    if _client is None:
        _client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)
    return _client

async def create_session(user_id: str) -> dict:
    client = get_client()
    result = client.table("sessions").insert({"user_id": user_id}).execute()
    return result.data[0]

async def save_message(session_id: str, role: str, content: str) -> dict:
    client = get_client()
    result = client.table("messages").insert({
        "session_id": session_id,
        "role": role,
        "content": content,
    }).execute()
    return result.data[0]

