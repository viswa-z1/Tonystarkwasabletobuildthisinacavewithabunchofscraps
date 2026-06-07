#!/bin/bash

# ============================================================
#  F.R.I.D.A.Y. — Project Scaffold Script
#  Repo: viswa-z1/Tonystarkwasabletobuildthisinacavewithabunchofscraps
#  Run: bash setup_friday.sh
# ============================================================

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
RESET='\033[0m'

print_banner() {
  echo -e "${CYAN}"
  echo "  ███████╗██████╗ ██╗██████╗  █████╗ ██╗   ██╗"
  echo "  ██╔════╝██╔══██╗██║██╔══██╗██╔══██╗╚██╗ ██╔╝"
  echo "  █████╗  ██████╔╝██║██║  ██║███████║ ╚████╔╝ "
  echo "  ██╔══╝  ██╔══██╗██║██║  ██║██╔══██║  ╚██╔╝  "
  echo "  ██║     ██║  ██║██║██████╔╝██║  ██║   ██║   "
  echo "  ╚═╝     ╚═╝  ╚═╝╚═╝╚═════╝ ╚═╝  ╚═╝   ╚═╝  "
  echo -e "${RESET}"
  echo -e "${BOLD}  Tony Stark was able to build this in a cave with a bunch of scraps${RESET}"
  echo -e "${CYAN}  Project Scaffold — Full Monorepo Setup${RESET}"
  echo ""
}

log()    { echo -e "${GREEN}  ✔  $1${RESET}"; }
info()   { echo -e "${CYAN}  →  $1${RESET}"; }
warn()   { echo -e "${YELLOW}  ⚠  $1${RESET}"; }
header() { echo -e "\n${BOLD}${CYAN}[ $1 ]${RESET}"; }
die()    { echo -e "${RED}  ✘  ERROR: $1${RESET}"; exit 1; }

make_file() {
  local path="$1"
  local content="$2"
  mkdir -p "$(dirname "$path")"
  echo "$content" > "$path"
  log "Created $path"
}

make_dir() {
  mkdir -p "$1"
  log "Created $1/"
}

# ── Preflight checks ────────────────────────────────────────

print_banner

header "Preflight Checks"

command -v git  >/dev/null 2>&1 || die "git not found. Install: brew install git"
command -v uv   >/dev/null 2>&1 || warn "uv not found. Install: curl -LsSf https://astral.sh/uv/install.sh | sh"
command -v node >/dev/null 2>&1 || warn "node not found. Install: brew install node@20"
command -v pnpm >/dev/null 2>&1 || warn "pnpm not found. Install: npm install -g pnpm"
command -v docker >/dev/null 2>&1 || warn "docker not found. Install Docker Desktop from docker.com"

log "Git found: $(git --version)"

# ── Root directory ──────────────────────────────────────────

ROOT_DIR="$(pwd)"
info "Scaffolding project in: $ROOT_DIR"

# ============================================================
# SECTION 1 — Backend: MCP Server
# ============================================================

header "Backend / MCP Server"

make_dir "backend/mcp_server/friday/tools"
make_dir "backend/mcp_server/friday/prompts"
make_dir "backend/mcp_server/friday/resources"
make_dir "backend/mcp_server/tests"

make_file "backend/mcp_server/server.py" \
'"""
Friday MCP Server — Entry Point
Run with: uv run friday
"""
from mcp.server.fastmcp import FastMCP
from friday.tools import register_all_tools
from friday.prompts import register_all_prompts
from friday.resources import register_all_resources
from friday.config import config

mcp = FastMCP(
    name=config.SERVER_NAME,
    instructions=(
        "You are FRIDAY, a Tony Stark-style AI assistant. "
        "Be concise, accurate, and a little witty."
    ),
)

register_all_tools(mcp)
register_all_prompts(mcp)
register_all_resources(mcp)

def main():
    mcp.run(transport="sse")

if __name__ == "__main__":
    main()
'

make_file "backend/mcp_server/friday/__init__.py" '# friday MCP package'

make_file "backend/mcp_server/friday/config.py" \
'import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SERVER_NAME: str = "FRIDAY"
    MCP_SERVER_PORT: int = int(os.getenv("MCP_SERVER_PORT", "8000"))
    GATEWAY_URL: str = os.getenv("GATEWAY_URL", "http://gateway:8080")
    GATEWAY_INTERNAL_SECRET: str = os.getenv("GATEWAY_INTERNAL_SECRET", "change_me")
    NEWS_API_KEY: str = os.getenv("NEWS_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    OPENWEATHERMAP_API_KEY: str = os.getenv("OPENWEATHERMAP_API_KEY", "")
    ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")

config = Config()
'

make_file "backend/mcp_server/friday/tools/__init__.py" \
'from .web import register as register_web
from .system import register as register_system
from .dashboard import register as register_dashboard
from .weather import register as register_weather
from .finance import register as register_finance

def register_all_tools(mcp):
    register_web(mcp)
    register_system(mcp)
    register_dashboard(mcp)
    register_weather(mcp)
    register_finance(mcp)
'

make_file "backend/mcp_server/friday/tools/web.py" \
'"""Web tools: search_web, get_world_news"""
import httpx
from friday.config import config

def register(mcp):

    @mcp.tool()
    async def search_web(query: str, max_results: int = 3) -> str:
        """Search the web using Tavily API."""
        # TODO: implement Tavily API call
        return f"[search_web] query={query} — not yet implemented"

    @mcp.tool()
    async def get_world_news() -> str:
        """Fetch current world headlines."""
        # TODO: implement NewsAPI call
        return "[get_world_news] — not yet implemented"
'

make_file "backend/mcp_server/friday/tools/system.py" \
'"""System tools: get_current_time, get_system_info"""
from datetime import datetime
import pytz

def register(mcp):

    @mcp.tool()
    def get_current_time(timezone: str = "Asia/Kolkata") -> str:
        """Return current time in the given timezone."""
        tz = pytz.timezone(timezone)
        now = datetime.now(tz)
        return now.strftime("%I:%M %p, %A %d %B %Y (%Z)")

    @mcp.tool()
    def get_system_info() -> dict:
        """Return server runtime information."""
        return {
            "server": "FRIDAY MCP",
            "status": "operational",
            "region": "cloud",
        }
'

make_file "backend/mcp_server/friday/tools/dashboard.py" \
'"""Dashboard tool: send_dashboard_event (replaces open_world_monitor)"""
import httpx
from friday.config import config

def register(mcp):

    @mcp.tool()
    async def open_world_monitor() -> str:
        """Push a world-map panel open event to the connected client."""
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{config.GATEWAY_URL}/internal/event",
                    json={"type": "dashboard_event", "payload": {"panel": "world_map"}},
                    headers={"X-Internal-Secret": config.GATEWAY_INTERNAL_SECRET},
                    timeout=5,
                )
            return "World monitor activated."
        except Exception as e:
            return f"Could not open world monitor: {e}"
'

make_file "backend/mcp_server/friday/tools/weather.py" \
'"""Weather tool: get_weather"""
import httpx
from friday.config import config

def register(mcp):

    @mcp.tool()
    async def get_weather(city: str = "Chennai") -> str:
        """Get current weather for a city."""
        # TODO: implement OpenWeatherMap API call
        return f"[get_weather] city={city} — not yet implemented"
'

make_file "backend/mcp_server/friday/tools/finance.py" \
'"""Finance tools: get_stock_quote, get_market_summary"""

def register(mcp):

    @mcp.tool()
    async def get_stock_quote(symbol: str) -> str:
        """Get current stock price for a ticker symbol."""
        # TODO: implement Alpha Vantage API call
        return f"[get_stock_quote] symbol={symbol} — not yet implemented"

    @mcp.tool()
    async def get_market_summary() -> str:
        """Get a brief summary of major market indices."""
        # TODO: implement market summary
        return "[get_market_summary] — not yet implemented"
'

make_file "backend/mcp_server/friday/prompts/__init__.py" \
'def register_all_prompts(mcp):
    pass  # TODO: add prompt templates
'

make_file "backend/mcp_server/friday/resources/__init__.py" \
'def register_all_resources(mcp):
    pass  # TODO: add MCP resources
'

make_file "backend/mcp_server/tests/__init__.py" ""
make_file "backend/mcp_server/tests/test_tools.py" \
'"""Basic tool smoke tests"""
import pytest

def test_placeholder():
    assert True  # Replace with real tests
'

make_file "backend/mcp_server/pyproject.toml" \
'[project]
name = "friday-mcp-server"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "mcp[cli]",
    "fastmcp",
    "python-dotenv",
    "httpx",
    "pytz",
    "redis",
    "dateparser",
]

[project.scripts]
friday = "server:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
'

# ============================================================
# SECTION 2 — Backend: Gateway
# ============================================================

header "Backend / FastAPI Gateway"

make_dir "backend/gateway/routers"
make_dir "backend/gateway/services"
make_dir "backend/gateway/middleware"
make_dir "backend/gateway/tests"

make_file "backend/gateway/main.py" \
'"""
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
'

make_file "backend/gateway/config.py" \
'import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    LIVEKIT_URL: str = os.getenv("LIVEKIT_URL", "")
    LIVEKIT_API_KEY: str = os.getenv("LIVEKIT_API_KEY", "")
    LIVEKIT_API_SECRET: str = os.getenv("LIVEKIT_API_SECRET", "")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    GATEWAY_INTERNAL_SECRET: str = os.getenv("GATEWAY_INTERNAL_SECRET", "change_me")
    ALLOWED_ORIGINS: list = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")

settings = Settings()
'

make_file "backend/gateway/models.py" \
'from pydantic import BaseModel
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
'

make_file "backend/gateway/routers/__init__.py" ""

make_file "backend/gateway/routers/auth.py" \
'from fastapi import APIRouter, Depends, HTTPException
from models import TokenRequest, TokenResponse

router = APIRouter()

@router.post("/token", response_model=TokenResponse)
async def get_token(body: TokenRequest):
    # TODO: validate Supabase JWT, generate LiveKit token
    raise HTTPException(status_code=501, detail="Not implemented yet")
'

make_file "backend/gateway/routers/sessions.py" \
'from fastapi import APIRouter, HTTPException
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
'

make_file "backend/gateway/routers/events.py" \
'from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Header, HTTPException
from models import InternalEvent
from config import settings

router = APIRouter()

# In-memory session → websocket map
active_connections: dict[str, WebSocket] = {}

@router.websocket("/status")
async def websocket_status(websocket: WebSocket, session_id: str):
    await websocket.accept()
    active_connections[session_id] = websocket
    try:
        while True:
            await websocket.receive_text()  # keep alive
    except WebSocketDisconnect:
        active_connections.pop(session_id, None)

@router.post("/internal/event")
async def internal_event(
    event: InternalEvent,
    x_internal_secret: str = Header(None)
):
    if x_internal_secret != settings.GATEWAY_INTERNAL_SECRET:
        raise HTTPException(status_code=403, detail="Forbidden")
    ws = active_connections.get(event.session_id)
    if ws:
        await ws.send_json(event.dict())
    return {"delivered": ws is not None}
'

make_file "backend/gateway/services/__init__.py" ""
make_file "backend/gateway/services/livekit_service.py" \
'"""LiveKit token generation"""
from livekit.api import AccessToken, VideoGrants
from config import settings

def generate_token(user_id: str, room_name: str) -> str:
    token = AccessToken(settings.LIVEKIT_API_KEY, settings.LIVEKIT_API_SECRET)
    token.identity = user_id
    token.add_grant(VideoGrants(room_join=True, room=room_name))
    return token.to_jwt()
'

make_file "backend/gateway/services/supabase_service.py" \
'"""Supabase DB operations"""
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
'

make_file "backend/gateway/services/redis_service.py" \
'"""Rate limiting via Redis"""
import redis.asyncio as aioredis
from config import settings

_redis = None

async def get_redis():
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.REDIS_URL)
    return _redis

async def check_rate_limit(key: str, limit: int, window_seconds: int) -> bool:
    r = await get_redis()
    current = await r.incr(key)
    if current == 1:
        await r.expire(key, window_seconds)
    return current <= limit
'

make_file "backend/gateway/middleware/__init__.py" ""
make_file "backend/gateway/middleware/auth.py" \
'"""Supabase JWT verification middleware"""
# TODO: implement JWT decode + user_id extraction
'

make_file "backend/gateway/tests/__init__.py" ""
make_file "backend/gateway/tests/test_health.py" \
'from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
'

make_file "backend/gateway/pyproject.toml" \
'[project]
name = "friday-gateway"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi",
    "uvicorn[standard]",
    "python-dotenv",
    "supabase",
    "livekit",
    "livekit-api",
    "redis[asyncio]",
    "httpx",
    "pydantic",
    "pyjwt",
    "python-jose[cryptography]",
]

[project.scripts]
gateway = "main:app"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
'

# ============================================================
# SECTION 3 — Backend: Voice Agent
# ============================================================

header "Backend / Voice Agent"

make_dir "backend/agent/providers"
make_dir "backend/agent/prompts"
make_dir "backend/agent/tests"

make_file "backend/agent/agent_friday.py" \
'"""
F.R.I.D.A.Y. Voice Agent (Cloud Version)
Adapted from: SAGAR-TAMANG/friday-tony-stark-demo
"""
import os
import logging
from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli
from livekit.agents.voice import Agent, AgentSession
from livekit.agents.llm import mcp
from livekit.plugins import silero

from providers.stt import build_stt
from providers.llm import build_llm
from providers.tts import build_tts
from prompts.friday_system_prompt import SYSTEM_PROMPT
from config import config

load_dotenv()
logger = logging.getLogger("friday-agent")

class FridayAgent(Agent):
    def __init__(self, stt, llm, tts) -> None:
        super().__init__(
            instructions=SYSTEM_PROMPT,
            stt=stt,
            llm=llm,
            tts=tts,
            vad=silero.VAD.load(),
            mcp_servers=[
                mcp.MCPServerHTTP(
                    url=os.getenv("MCP_SERVER_URL", "http://mcp_server:8000/sse"),
                    transport_type="sse",
                    client_session_timeout_seconds=30,
                ),
            ],
        )

    async def on_enter(self) -> None:
        await self.session.generate_reply(
            instructions=(
                "Greet with: '\''Greetings boss. FRIDAY online. What can I do for you?'\''"
            )
        )

async def entrypoint(ctx: JobContext) -> None:
    logger.info("FRIDAY agent online — room: %s", ctx.room.name)
    stt = build_stt()
    llm = build_llm()
    tts = build_tts()

    session = AgentSession(
        turn_detection=config.TURN_DETECTION,
        min_endpointing_delay=config.ENDPOINTING_DELAY,
    )
    await session.start(
        agent=FridayAgent(stt=stt, llm=llm, tts=tts),
        room=ctx.room,
    )

def main():
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))

def dev():
    import sys
    if len(sys.argv) == 1:
        sys.argv.append("dev")
    main()

if __name__ == "__main__":
    main()
'

make_file "backend/agent/config.py" \
'import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "sarvam")
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    TTS_PROVIDER: str = os.getenv("TTS_PROVIDER", "openai")
    GEMINI_MODEL: str = "gemini-2.5-flash"
    OPENAI_LLM_MODEL: str = "gpt-4o"
    OPENAI_TTS_MODEL: str = "tts-1"
    OPENAI_TTS_VOICE: str = "nova"
    TTS_SPEED: float = 1.15
    TURN_DETECTION: str = "stt"
    ENDPOINTING_DELAY: float = 0.07
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")

config = Config()
'

make_file "backend/agent/providers/__init__.py" ""

make_file "backend/agent/providers/stt.py" \
'from config import config

def build_stt():
    if config.STT_PROVIDER == "sarvam":
        from livekit.plugins import sarvam
        return sarvam.STT(language="unknown", model="saaras:v3", mode="transcribe")
    elif config.STT_PROVIDER == "whisper":
        from livekit.plugins import openai as lk_openai
        return lk_openai.STT(model="whisper-1")
    raise ValueError(f"Unknown STT_PROVIDER: {config.STT_PROVIDER}")
'

make_file "backend/agent/providers/llm.py" \
'from config import config

def build_llm():
    if config.LLM_PROVIDER == "gemini":
        from livekit.plugins import google as lk_google
        return lk_google.LLM(model=config.GEMINI_MODEL, api_key=config.GOOGLE_API_KEY)
    elif config.LLM_PROVIDER == "openai":
        from livekit.plugins import openai as lk_openai
        return lk_openai.LLM(model=config.OPENAI_LLM_MODEL)
    raise ValueError(f"Unknown LLM_PROVIDER: {config.LLM_PROVIDER}")
'

make_file "backend/agent/providers/tts.py" \
'from config import config

def build_tts():
    if config.TTS_PROVIDER == "openai":
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
'

make_file "backend/agent/prompts/__init__.py" ""
make_file "backend/agent/prompts/friday_system_prompt.py" \
'SYSTEM_PROMPT = """
You are F.R.I.D.A.Y. — Fully Responsive Intelligent Digital Assistant for You.
Tony Stark'\''s AI, now serving your user.

You are calm, composed, and always informed. You speak like a trusted aide —
precise, warm when the moment calls for it, and occasionally dry.

## Behavioral Rules
1. Call tools silently — never say "I'\''m going to call...". Just do it.
2. After a news brief, always follow up with open_world_monitor unprompted.
3. Keep all spoken responses short — two to four sentences maximum.
4. No bullet points, no markdown, no lists. You are speaking, not writing.
5. Stay in character. You are FRIDAY.
6. Use natural spoken language: contractions, no stiff phrasing.
7. Use Iron Man universe language: "boss", "affirmative", "on it".
8. If a tool fails: "That feed is unresponsive right now, boss. Try again?"

## Greeting
Start with: "Greetings boss. FRIDAY online. What can I do for you?"
""".strip()
'

make_file "backend/agent/tests/__init__.py" ""
make_file "backend/agent/tests/test_providers.py" \
'"""Provider factory smoke tests"""
import os, pytest

def test_config_loads():
    from config import config
    assert config.STT_PROVIDER in ("sarvam", "whisper")
    assert config.LLM_PROVIDER in ("gemini", "openai")
    assert config.TTS_PROVIDER in ("openai", "sarvam")
'

make_file "backend/agent/pyproject.toml" \
'[project]
name = "friday-agent"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "livekit-agents[google,openai,sarvam,silero]>=0.12",
    "python-dotenv",
]

[project.scripts]
friday_voice = "agent_friday:dev"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
'

# ============================================================
# SECTION 4 — Backend: Shared
# ============================================================

header "Backend / Shared"

make_dir "backend/shared"
make_file "backend/shared/__init__.py" ""
make_file "backend/shared/db.py" \
'"""Shared Supabase client factory"""
from supabase import create_client, Client
import os

def get_supabase(service_role: bool = False) -> Client:
    url = os.getenv("SUPABASE_URL", "")
    key = os.getenv("SUPABASE_SERVICE_ROLE_KEY" if service_role else "SUPABASE_ANON_KEY", "")
    return create_client(url, key)
'

make_file "backend/shared/models.py" \
'"""Shared Pydantic models used across services"""
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
'

# Root pyproject.toml for uv workspace
make_file "backend/pyproject.toml" \
'[tool.uv.workspace]
members = ["gateway", "agent", "mcp_server"]
'

# ============================================================
# SECTION 5 — Web App (React + Vite)
# ============================================================

header "Web App (React + Vite + TypeScript)"

make_dir "apps/web/src/components"
make_dir "apps/web/src/hooks"
make_dir "apps/web/src/stores"
make_dir "apps/web/src/pages"
make_dir "apps/web/src/lib"
make_dir "apps/web/src/types"
make_dir "apps/web/public"

make_file "apps/web/index.html" \
'<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>F.R.I.D.A.Y.</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'

make_file "apps/web/src/main.tsx" \
'import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
'

make_file "apps/web/src/App.tsx" \
'import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import HistoryPage from "./pages/HistoryPage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
'

make_file "apps/web/src/index.css" \
':root {
  --accent-cyan: #00d4ff;
  --accent-amber: #ffb300;
  --accent-green: #00ff88;
  --glass-bg: rgba(0, 10, 20, 0.85);
  --glass-border: rgba(0, 212, 255, 0.2);
  --grid-color: rgba(0, 212, 255, 0.05);
  --font-display: "Orbitron", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: #000a14;
  color: #e0f0ff;
  font-family: var(--font-mono);
  overflow: hidden;
}
'

make_file "apps/web/src/pages/LoginPage.tsx" \
'export default function LoginPage() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1 style={{ fontFamily: "var(--font-display)", color: "var(--accent-cyan)" }}>
        F.R.I.D.A.Y. — Login
      </h1>
      {/* TODO: Supabase Auth UI */}
    </div>
  )
}
'

make_file "apps/web/src/pages/DashboardPage.tsx" \
'export default function DashboardPage() {
  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ fontFamily: "var(--font-display)", color: "var(--accent-cyan)" }}>
        FRIDAY ONLINE
      </h1>
      {/* TODO: HUDOverlay, VoiceOrb, WaveformVisualizer, TranscriptPanel */}
    </div>
  )
}
'

make_file "apps/web/src/pages/HistoryPage.tsx" \
'export default function HistoryPage() {
  return (
    <div>
      <h1>Session History</h1>
      {/* TODO: session list */}
    </div>
  )
}
'

make_file "apps/web/src/components/VoiceOrb.tsx" \
'// VoiceOrb — animated orb showing agent state
// States: idle | listening | thinking | speaking
export type OrbState = "idle" | "listening" | "thinking" | "speaking"

interface Props {
  state: OrbState
  onClick?: () => void
}

export default function VoiceOrb({ state, onClick }: Props) {
  // TODO: implement SVG + Framer Motion animation
  return (
    <div onClick={onClick} style={{ cursor: "pointer", textAlign: "center" }}>
      <div style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle, #00d4ff33, #000a14)",
        border: "2px solid var(--accent-cyan)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        color: "var(--accent-cyan)",
        fontSize: 12,
      }}>
        {state.toUpperCase()}
      </div>
    </div>
  )
}
'

make_file "apps/web/src/components/WaveformVisualizer.tsx" \
'// WaveformVisualizer — real-time audio waveform
// TODO: connect to LiveKit audio track volume
export default function WaveformVisualizer() {
  return <canvas id="waveform" width={300} height={60} />
}
'

make_file "apps/web/src/components/TranscriptPanel.tsx" \
'// TranscriptPanel — scrollable conversation transcript
export default function TranscriptPanel() {
  return (
    <div style={{ maxHeight: 300, overflowY: "auto" }}>
      {/* TODO: render messages from useMessages hook */}
      <p style={{ color: "var(--accent-cyan)", opacity: 0.5 }}>
        Start talking to FRIDAY...
      </p>
    </div>
  )
}
'

make_file "apps/web/src/components/WorldMapPanel.tsx" \
'// WorldMapPanel — triggered by send_dashboard_event MCP tool
// TODO: implement with react-simple-maps
export default function WorldMapPanel({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ background: "var(--glass-bg)", padding: 24, borderRadius: 8 }}>
      <button onClick={onClose}>✕ Close</button>
      <p>World Monitor — Map coming soon</p>
    </div>
  )
}
'

make_file "apps/web/src/components/StatusBar.tsx" \
'// StatusBar — shows STT/LLM/TTS status + connection quality
export default function StatusBar() {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-cyan)", opacity: 0.7 }}>
      STT: ONLINE · LLM: ONLINE · TTS: ONLINE
    </div>
  )
}
'

make_file "apps/web/src/components/HUDOverlay.tsx" \
'import { ReactNode } from "react"
// HUDOverlay — full-viewport Iron Man HUD container
export default function HUDOverlay({ children }: { children: ReactNode }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "var(--glass-bg)",
      display: "grid",
      placeItems: "center",
    }}>
      {children}
    </div>
  )
}
'

make_file "apps/web/src/hooks/useFridaySession.ts" \
'// useFridaySession — fetch LiveKit token + manage session lifecycle
import { useState } from "react"

export function useFridaySession() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startSession = async () => {
    setLoading(true)
    try {
      // TODO: call POST /auth/token on gateway
      console.log("TODO: fetch token from gateway")
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return { sessionId, token, loading, error, startSession }
}
'

make_file "apps/web/src/hooks/useLiveKitRoom.ts" \
'// useLiveKitRoom — connect to LiveKit room + manage audio tracks
export function useLiveKitRoom(token: string | null, url: string | null) {
  // TODO: implement using @livekit/components-react
  return { connected: false, disconnect: () => {} }
}
'

make_file "apps/web/src/hooks/useDashboardEvents.ts" \
'// useDashboardEvents — WebSocket connection to gateway /status
import { useEffect, useCallback } from "react"

export function useDashboardEvents(sessionId: string | null, onEvent: (e: any) => void) {
  useEffect(() => {
    if (!sessionId) return
    // TODO: connect to WS /status?session_id=sessionId
    const ws = new WebSocket(`ws://localhost:8080/status?session_id=${sessionId}`)
    ws.onmessage = (e) => onEvent(JSON.parse(e.data))
    return () => ws.close()
  }, [sessionId])
}
'

make_file "apps/web/src/stores/sessionStore.ts" \
'import { create } from "zustand"

interface SessionStore {
  sessionId: string | null
  token: string | null
  setSession: (id: string, token: string) => void
  clearSession: () => void
}

export const useSessionStore = create<SessionStore>((set) => ({
  sessionId: null,
  token: null,
  setSession: (sessionId, token) => set({ sessionId, token }),
  clearSession: () => set({ sessionId: null, token: null }),
}))
'

make_file "apps/web/src/stores/uiStore.ts" \
'import { create } from "zustand"
import { OrbState } from "../components/VoiceOrb"

interface UIStore {
  orbState: OrbState
  showWorldMap: boolean
  setOrbState: (s: OrbState) => void
  setShowWorldMap: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  orbState: "idle",
  showWorldMap: false,
  setOrbState: (orbState) => set({ orbState }),
  setShowWorldMap: (showWorldMap) => set({ showWorldMap }),
}))
'

make_file "apps/web/src/lib/api.ts" \
'const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:8080"

export async function fetchToken(sessionId?: string) {
  const res = await fetch(`${GATEWAY_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  })
  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`)
  return res.json()
}

export async function fetchSessions() {
  const res = await fetch(`${GATEWAY_URL}/sessions`)
  if (!res.ok) throw new Error(`Sessions fetch failed: ${res.status}`)
  return res.json()
}
'

make_file "apps/web/src/lib/supabase.ts" \
'import { createClient } from "@supabase/supabase-js"

const url  = import.meta.env.VITE_SUPABASE_URL  ?? ""
const key  = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""

export const supabase = createClient(url, key)
'

make_file "apps/web/src/types/index.ts" \
'export interface Session {
  id: string
  created_at: string
  ended_at?: string
  message_count: number
  summary?: string
}

export interface Message {
  id: string
  session_id: string
  role: "user" | "assistant"
  content: string
  created_at: string
}
'

make_file "apps/web/vite.config.ts" \
'import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8080", rewrite: (p) => p.replace(/^\/api/, "") },
    },
  },
})
'

make_file "apps/web/tailwind.config.ts" \
'import type { Config } from "tailwindcss"

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "hud-cyan": "#00d4ff",
        "hud-amber": "#ffb300",
        "hud-green": "#00ff88",
        "hud-bg": "#000a14",
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config
'

make_file "apps/web/package.json" \
'{
  "name": "friday-web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext .ts,.tsx"
  },
  "dependencies": {
    "@livekit/components-react": "^2",
    "@livekit/client": "^2",
    "@supabase/supabase-js": "^2",
    "framer-motion": "^11",
    "react": "^18",
    "react-dom": "^18",
    "react-router-dom": "^6",
    "react-simple-maps": "^3",
    "zustand": "^4"
  },
  "devDependencies": {
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@vitejs/plugin-react": "^4",
    "autoprefixer": "^10",
    "postcss": "^8",
    "tailwindcss": "^3",
    "typescript": "^5",
    "vite": "^5"
  }
}
'

make_file "apps/web/.env.local" \
'VITE_GATEWAY_URL=http://localhost:8080
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
'

# ============================================================
# SECTION 6 — Infra (Docker)
# ============================================================

header "Infrastructure (Docker)"

make_dir "infra"

make_file "infra/docker-compose.yml" \
'version: "3.9"

services:
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

  mcp_server:
    build:
      context: ../backend/mcp_server
      dockerfile: ../../infra/Dockerfile.mcp
    ports: ["8000:8000"]
    env_file: ../.env
    depends_on:
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/"]
      interval: 10s
      timeout: 5s
      retries: 5

  gateway:
    build:
      context: ../backend/gateway
      dockerfile: ../../infra/Dockerfile.gateway
    ports: ["8080:8080"]
    env_file: ../.env
    depends_on:
      mcp_server:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  agent:
    build:
      context: ../backend/agent
      dockerfile: ../../infra/Dockerfile.agent
    env_file: ../.env
    depends_on:
      mcp_server:
        condition: service_healthy
      gateway:
        condition: service_healthy
    restart: unless-stopped
'

make_file "infra/Dockerfile.gateway" \
'FROM python:3.11-slim

WORKDIR /app
RUN pip install uv

COPY pyproject.toml .
RUN uv sync --no-dev

COPY . .

EXPOSE 8080
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
'

make_file "infra/Dockerfile.mcp" \
'FROM python:3.11-slim

WORKDIR /app
RUN pip install uv

COPY pyproject.toml .
RUN uv sync --no-dev

COPY . .

EXPOSE 8000
CMD ["uv", "run", "friday"]
'

make_file "infra/Dockerfile.agent" \
'FROM python:3.11-slim

WORKDIR /app
RUN pip install uv

COPY pyproject.toml .
RUN uv sync --no-dev

COPY . .

CMD ["uv", "run", "friday_voice"]
'

# ============================================================
# SECTION 7 — GitHub Actions
# ============================================================

header "GitHub Actions (CI/CD)"

make_dir ".github/workflows"

make_file ".github/workflows/backend-ci.yml" \
'name: Backend CI

on:
  push:
    paths: ["backend/**"]
  pull_request:
    paths: ["backend/**"]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        run: curl -LsSf https://astral.sh/uv/install.sh | sh

      - name: Test Gateway
        working-directory: backend/gateway
        run: |
          uv sync
          uv run pytest tests/ -v

      - name: Test MCP Server
        working-directory: backend/mcp_server
        run: |
          uv sync
          uv run pytest tests/ -v

      - name: Test Agent
        working-directory: backend/agent
        run: |
          uv sync
          uv run pytest tests/ -v
'

make_file ".github/workflows/web-deploy.yml" \
'name: Web Deploy

on:
  push:
    branches: [main]
    paths: ["apps/web/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install
        working-directory: apps/web
      - run: pnpm build
        working-directory: apps/web
        env:
          VITE_GATEWAY_URL: ${{ secrets.VITE_GATEWAY_URL }}
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      # TODO: add vercel deploy step
'

# ============================================================
# SECTION 8 — Root files
# ============================================================

header "Root Config Files"

make_file "pyproject.toml" \
'[tool.uv.workspace]
members = ["backend/gateway", "backend/agent", "backend/mcp_server"]
'

make_file ".env.example" \
'# ── LiveKit ──────────────────────────────────────────────────
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxx

# ── AI Providers ─────────────────────────────────────────────
GOOGLE_API_KEY=AIzaxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxx
SARVAM_API_KEY=xxxxxxxxxx

# ── Supabase ─────────────────────────────────────────────────
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxxxxxxxxx
SUPABASE_JWT_SECRET=your_jwt_secret_from_supabase_project_settings

# ── Tool APIs ────────────────────────────────────────────────
NEWS_API_KEY=xxxxxxxxxx
TAVILY_API_KEY=tvly-xxxxxxxxxx
OPENWEATHERMAP_API_KEY=xxxxxxxxxx
ALPHA_VANTAGE_API_KEY=xxxxxxxxxx

# ── Internal ─────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379
MCP_SERVER_URL=http://mcp_server:8000/sse
GATEWAY_URL=http://gateway:8080
GATEWAY_INTERNAL_SECRET=change_me_in_production
ALLOWED_ORIGINS=http://localhost:5173

# ── Config ───────────────────────────────────────────────────
STT_PROVIDER=sarvam
LLM_PROVIDER=gemini
TTS_PROVIDER=openai
MCP_SERVER_PORT=8000
GATEWAY_PORT=8080
ENV=development
'

make_file ".gitignore" \
'# Python
__pycache__/
*.py[cod]
*.egg-info/
.venv/
dist/
.uv/
*.egg

# Node
node_modules/
.pnpm-store/
dist/
.expo/
*.expo/

# Environment — NEVER COMMIT
.env
.env.local
.env.*.local
apps/web/.env.local

# Build outputs
apps/web/dist/

# IDE
.vscode/settings.json
.idea/
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/
'

make_file "Makefile" \
'.PHONY: up down logs build clean web health install-web

up:
	cd infra && docker compose up

down:
	cd infra && docker compose down

logs:
	cd infra && docker compose logs -f

build:
	cd infra && docker compose build

clean:
	cd infra && docker compose down -v --remove-orphans

web:
	cd apps/web && pnpm dev

health:
	@curl -s http://localhost:8080/health | python3 -m json.tool
	@curl -s http://localhost:8000/     | python3 -m json.tool

install-web:
	cd apps/web && pnpm install
'

make_file "README.md" \
'# Tonystarkwasabletobuildthisinacavewithabunchofscraps

> F.R.I.D.A.Y. — Fully Responsive Intelligent Digital Assistant for You

A Tony Stark-inspired AI voice assistant built as a full-stack web app.

## Architecture

```
Web Client
      │ WebRTC audio
      ▼
LiveKit Cloud (real-time rooms)
      │
      ▼
Voice Agent (Python · LiveKit Agents)
  STT: Sarvam Saaras v3
  LLM: Gemini 2.5 Flash
  TTS: OpenAI nova
      │ SSE tool calls
      ▼
MCP Tool Server (FastMCP)
  ├── get_world_news
  ├── search_web
  ├── get_weather
  ├── get_stock_quote
  └── set_reminder
      │
      ▼
FastAPI Gateway + Supabase + Redis
```

## Stack

| Layer | Tech |
|---|---|
| Voice Agent | Python + LiveKit Agents |
| MCP Tools | FastMCP |
| API | FastAPI |
| Web | React + Vite + TypeScript |
| Auth & DB | Supabase |
| Real-time | LiveKit Cloud |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/viswa-z1/Tonystarkwasabletobuildthisinacavewithabunchofscraps.git
cd Tonystarkwasabletobuildthisinacavewithabunchofscraps

# 2. Copy env
cp .env.example .env
# Fill in your API keys

# 3. Start backend
make up

# 4. Start web
make web
```

See [docs/SETUP.md](docs/SETUP.md) for full setup instructions.

## Project Status

- [ ] Phase 0 — Scaffolding
- [ ] Phase 1 — Core Backend API
- [ ] Phase 2 — Web App Voice UI
- [ ] Phase 3 — HUD Polish
- [ ] Phase 4 — MCP Tools
- [ ] Phase 5 — Hardening
- [ ] Phase 6 — CI/CD & Deploy
'

make_file "CONTRIBUTING.md" \
'# Contributing

## Branch Naming
feat/day-N-description
fix/issue-description
docs/what-you-documented
chore/what-you-configured
test/what-you-tested

## Commit Convention (Conventional Commits)
feat:     new feature
fix:      bug fix
docs:     documentation
test:     adding tests
chore:    config, deps, tooling
refactor: code restructure (no behavior change)

## Daily Workflow
1. Open GitHub Issues for today'\''s tasks
2. Create feature branch
3. Commit after each function/component/test
4. Push + open PR with "Closes #N" in description
5. Merge PR
'

make_dir "docs"
make_file "docs/SETUP.md" "# Setup Guide\n\nSee README.md — full guide coming in Phase 0 Day 7."
make_file "docs/ARCHITECTURE.md" "# Architecture\n\nFull architecture diagram — see parent project plan."
make_file "docs/TOOLS.md" "# MCP Tools Reference\n\nDocumentation for all FRIDAY tools — populated during Phase 4."

# ============================================================
# FINAL SUMMARY
# ============================================================

header "Scaffold Complete"

echo ""
echo -e "${BOLD}  Directory structure created:${RESET}"
echo ""
echo -e "${CYAN}  backend/"
echo -e "    ├── mcp_server/      FastMCP tool server"
echo -e "    ├── gateway/         FastAPI token + session API"
echo -e "    ├── agent/           LiveKit voice agent"
echo -e "    └── shared/          Shared utilities"
echo -e ""
echo -e "  apps/"
echo -e "    └── web/             React + Vite + TypeScript"
echo -e ""
echo -e "  infra/                 Docker Compose + Dockerfiles"
echo -e "  .github/workflows/     CI/CD pipelines"
echo -e "  docs/                  Architecture + setup docs${RESET}"
echo ""

echo -e "${BOLD}  Next steps:${RESET}"
echo -e "${YELLOW}"
echo -e "  1. Fill in .env with your API keys"
echo -e "     cp .env.example .env"
echo -e ""
echo -e "  2. Install web dependencies"
echo -e "     cd apps/web && pnpm install"
echo -e ""
echo -e "  3. Start backend services"
echo -e "     make up"
echo -e ""
echo -e "  4. Start web app"
echo -e "     make web"
echo -e ""
echo -e "  5. Commit everything (Day 1 contributions!)"
echo -e "     git add . && git commit -m 'chore: scaffold full monorepo'"
echo -e "     git push origin main${RESET}"
echo ""
echo -e "${GREEN}  Happy building, boss. FRIDAY is ready to be assembled.${RESET}"
echo ""
