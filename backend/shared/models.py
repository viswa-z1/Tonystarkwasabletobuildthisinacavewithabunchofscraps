"""Shared Pydantic models used across services"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Session(BaseModel):
    id: str
    user_id: str
    created_at: datetime
    ended_at: Optional[datetime] = None
    message_count: int = 0

class Message(BaseModel):
    id: str
    session_id: str
    role: str
    content: str
    created_at: datetime

