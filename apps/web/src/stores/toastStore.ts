import { create } from "zustand"

export type ToastKind = "info" | "success" | "warn" | "error"

export interface Toast {
  id: number
  kind: ToastKind
  message: string
}

export interface ToastRecord extends Toast {
  at: number
}

const HISTORY_CAP = 40

interface ToastStore {
  toasts: Toast[]
  history: ToastRecord[]
  push: (kind: ToastKind, message: string, ttl?: number) => number
  dismiss: (id: number) => void
  clearHistory: () => void
}

let nextId = 1

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  history: [],
  push: (kind, message, ttl = 4000) => {
    const id = nextId++
    set((s) => ({
      toasts: [...s.toasts, { id, kind, message }],
      history: [{ id, kind, message, at: Date.now() }, ...s.history].slice(0, HISTORY_CAP),
    }))
    if (ttl > 0) setTimeout(() => get().dismiss(id), ttl)
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clearHistory: () => set({ history: [] }),
}))

/**
 * Imperative helper so any module — not just React components — can raise a
 * HUD toast: `toast.success("Reactor stable")`.
 */
export const toast = {
  info:    (m: string, ttl?: number) => useToastStore.getState().push("info", m, ttl),
  success: (m: string, ttl?: number) => useToastStore.getState().push("success", m, ttl),
  warn:    (m: string, ttl?: number) => useToastStore.getState().push("warn", m, ttl),
  error:   (m: string, ttl?: number) => useToastStore.getState().push("error", m, ttl),
}
