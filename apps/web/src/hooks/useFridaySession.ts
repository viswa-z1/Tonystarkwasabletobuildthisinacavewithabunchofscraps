// useFridaySession — fetch LiveKit token + manage session lifecycle
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

