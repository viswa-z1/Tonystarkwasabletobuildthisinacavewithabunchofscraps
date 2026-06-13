import { create } from "zustand"

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

