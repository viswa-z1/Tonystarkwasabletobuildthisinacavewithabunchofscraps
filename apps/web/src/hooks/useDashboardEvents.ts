// useDashboardEvents — WebSocket connection to gateway /status
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

