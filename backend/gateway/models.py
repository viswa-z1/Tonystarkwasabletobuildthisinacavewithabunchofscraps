from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class TokenRequest(BaseModel):
    session_id: Optional[str] = None

class TokenResponse(BaseModel):
    token: str
    room_name: str
    livekit_url: str
    session_id: str

class SessionResponse(BaseModel):
    id: str
    created_at: datetime
    ended_at: Optional[datetime]
    message_count: int
    summary: Optional[str]

class MessageResponse(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    created_at: datetime

class InternalEvent(BaseModel):
    session_id: Optional[str] = None
    type: str
    payload: Optional[dict] = None

