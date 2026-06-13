import { create } from "zustand"
import { OrbState } from "../components/VoiceOrb"

interface UIStore {
  orbState: OrbState
  showWorldMap: boolean
  setOrbState: (s: OrbState) => void
  setShowWorldMap: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  orbState: "idle",
  showWorldMap: false,
  setOrbState: (orbState) => set({ orbState }),
  setShowWorldMap: (showWorldMap) => set({ showWorldMap }),
}))

