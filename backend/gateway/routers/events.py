from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Header, HTTPException
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

