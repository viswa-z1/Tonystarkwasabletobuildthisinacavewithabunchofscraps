from fastapi import APIRouter, HTTPException
from typing import List
from models import SessionResponse, MessageResponse

router = APIRouter()

@router.get("/", response_model=List[SessionResponse])
async def list_sessions():
    raise HTTPException(status_code=501, detail="Not implemented yet")

@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(session_id: str):
    raise HTTPException(status_code=501, detail="Not implemented yet")

@router.get("/{session_id}/messages", response_model=List[MessageResponse])
async def get_messages(session_id: str):
    raise HTTPException(status_code=501, detail="Not implemented yet")

