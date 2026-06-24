import { create } from "zustand"
import { OrbState } from "../components/VoiceOrb"

interface UIStore {
  orbState: OrbState
  showWorldMap: boolean
  commandOpen: boolean
  setOrbState: (s: OrbState) => void
  setShowWorldMap: (v: boolean) => void
  setCommandOpen: (v: boolean) => void
  toggleCommand: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  orbState: "idle",
  showWorldMap: false,
  commandOpen: false,
  setOrbState: (orbState) => set({ orbState }),
  setShowWorldMap: (showWorldMap) => set({ showWorldMap }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
}))

