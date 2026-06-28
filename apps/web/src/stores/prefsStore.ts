import { create } from "zustand"

export type MotionPref = "system" | "reduced" | "full"

const KEY = "friday.motion"

function load(): MotionPref {
  try {
    const v = localStorage.getItem(KEY)
    if (v === "system" || v === "reduced" || v === "full") return v
  } catch {
    /* ignore */
  }
  return "system"
}

interface PrefsStore {
  motionPref: MotionPref
  setMotionPref: (m: MotionPref) => void
}

export const usePrefsStore = create<PrefsStore>((set) => ({
  motionPref: load(),
  setMotionPref: (motionPref) => {
    try {
      localStorage.setItem(KEY, motionPref)
    } catch {
      /* ignore */
    }
    set({ motionPref })
  },
}))
