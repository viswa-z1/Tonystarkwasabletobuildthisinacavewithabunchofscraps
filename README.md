# Tonystarkwasabletobuildthisinacavewithabunchofscraps


> F.R.I.D.A.Y. — Fully Responsive Intelligent Digital Assistant for You

A Tony Stark-inspired AI voice assistant built as a full-stack web and mobile app.

## Architecture

```
Client (Web / Mobile)
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
| Mobile | Expo (React Native) |
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
- [ ] Phase 5 — Mobile App
- [ ] Phase 6 — Hardening
- [ ] Phase 7 — CI/CD & Deploy
=======
Friday - Personal AI assistant

