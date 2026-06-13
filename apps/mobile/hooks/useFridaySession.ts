import { useState } from "react"

export function useFridaySession() {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startSession = async () => {
    setLoading(true)
    try {
      // TODO: fetch from gateway
      setSessionId(null)
      setToken(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start session")
    } finally {
      setLoading(false)
    }
  }

  return { sessionId, token, loading, error, startSession }
}
