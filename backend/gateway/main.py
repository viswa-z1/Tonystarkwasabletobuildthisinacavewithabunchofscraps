"""
FRIDAY API Gateway
Handles: LiveKit token generation, session CRUD, WebSocket events
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, sessions, events
from config import settings

app = FastAPI(title="FRIDAY Gateway", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(events.router, tags=["events"])

@app.get("/health")
async def health():
    return {"status": "ok", "service": "friday-gateway"}

