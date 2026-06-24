import { create } from "zustand"

export type ToastKind = "info" | "success" | "warn" | "error"

export interface Toast {
  id: number
  kind: ToastKind
  message: string
}

interface ToastStore {
  toasts: Toast[]
  push: (kind: ToastKind, message: string, ttl?: number) => number
  dismiss: (id: number) => void
}

let nextId = 1

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  push: (kind, message, ttl = 4000) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { id, kind, message }] }))
    if (ttl > 0) setTimeout(() => get().dismiss(id), ttl)
    return id
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
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
