import { create } from "zustand"

export type MotionPref = "system" | "reduced" | "full"
export type Density = "comfortable" | "compact"

const MOTION_KEY = "friday.motion"
const DENSITY_KEY = "friday.density"

function loadMotion(): MotionPref {
  try {
    const v = localStorage.getItem(MOTION_KEY)
    if (v === "system" || v === "reduced" || v === "full") return v
  } catch {
    /* ignore */
  }
  return "system"
}

function loadDensity(): Density {
  try {
    const v = localStorage.getItem(DENSITY_KEY)
    if (v === "comfortable" || v === "compact") return v
  } catch {
    /* ignore */
  }
  return "comfortable"
}

/** Reflect density on the root element so CSS can key off it if needed. */
function applyDensity(d: Density) {
  if (typeof document === "undefined") return
  document.documentElement.dataset.density = d
}

const initialDensity = loadDensity()
applyDensity(initialDensity)

interface PrefsStore {
  motionPref: MotionPref
  density: Density
  setMotionPref: (m: MotionPref) => void
  setDensity: (d: Density) => void
}

export const usePrefsStore = create<PrefsStore>((set) => ({
  motionPref: loadMotion(),
  density: initialDensity,
  setMotionPref: (motionPref) => {
    try {
      localStorage.setItem(MOTION_KEY, motionPref)
    } catch {
      /* ignore */
    }
    set({ motionPref })
  },
  setDensity: (density) => {
    try {
      localStorage.setItem(DENSITY_KEY, density)
    } catch {
      /* ignore */
    }
    applyDensity(density)
    set({ density })
  },
}))
