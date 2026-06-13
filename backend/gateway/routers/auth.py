from fastapi import APIRouter, Depends, HTTPException
from models import TokenRequest, TokenResponse

router = APIRouter()

@router.post("/token", response_model=TokenResponse)
async def get_token(body: TokenRequest):
    # TODO: validate Supabase JWT, generate LiveKit token
    raise HTTPException(status_code=501, detail="Not implemented yet")

