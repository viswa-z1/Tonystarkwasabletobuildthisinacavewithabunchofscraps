const GATEWAY_URL = import.meta.env.VITE_GATEWAY_URL ?? "http://localhost:8080"

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

