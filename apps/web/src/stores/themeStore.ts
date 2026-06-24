import { create } from "zustand"

export type Accent = "cyan" | "amber" | "green" | "red"

export const ACCENTS: Record<Accent, string> = {
  cyan:  "#00d4ff",
  amber: "#ffb300",
  green: "#00ff88",
  red:   "#ff3366",
}

const STORAGE_KEY = "friday.accent"

function applyAccent(a: Accent) {
  if (typeof document === "undefined") return
  document.documentElement.style.setProperty("--accent", ACCENTS[a])
}

function loadAccent(): Accent {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && saved in ACCENTS) return saved as Accent
  } catch {
    /* ignore */
  }
  return "cyan"
}

const initial = loadAccent()
applyAccent(initial)

interface ThemeStore {
  accent: Accent
  setAccent: (a: Accent) => void
}

export const useThemeStore = create<ThemeStore>((set) => ({
  accent: initial,
  setAccent: (accent) => {
    applyAccent(accent)
    try {
      localStorage.setItem(STORAGE_KEY, accent)
    } catch {
      /* ignore */
    }
    set({ accent })
  },
}))
