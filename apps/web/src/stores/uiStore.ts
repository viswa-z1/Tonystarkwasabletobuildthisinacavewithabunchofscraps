import { create } from "zustand"
import { OrbState } from "../components/VoiceOrb"

interface UIStore {
  orbState: OrbState
  showWorldMap: boolean
  commandOpen: boolean
  settingsOpen: boolean
  setOrbState: (s: OrbState) => void
  setShowWorldMap: (v: boolean) => void
  setCommandOpen: (v: boolean) => void
  toggleCommand: () => void
  setSettingsOpen: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  orbState: "idle",
  showWorldMap: false,
  commandOpen: false,
  settingsOpen: false,
  setOrbState: (orbState) => set({ orbState }),
  setShowWorldMap: (showWorldMap) => set({ showWorldMap }),
  setCommandOpen: (commandOpen) => set({ commandOpen }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),
  setSettingsOpen: (settingsOpen) => set({ settingsOpen }),
}))

