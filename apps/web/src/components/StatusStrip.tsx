import { useEffect, useRef, useState } from "react"
import { useUIStore } from "@/stores/uiStore"

function fmt(ms: number) {
  const s = Math.floor(ms / 1000)
  const p = (n: number) => n.toString().padStart(2, "0")
  return `${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`
}

/**
 * Footer status strip. Replaces the static labels with a live session timer and
 * a clickable command-palette hint for discoverability, keeping the secure
 * channel and bridge readouts.
 */
export default function StatusStrip() {
  const setCommandOpen = useUIStore((s) => s.setCommandOpen)
  const [uptime, setUptime] = useState(0)
  const mount = useRef(Date.now())

  useEffect(() => {
    const t = setInterval(() => setUptime(Date.now() - mount.current), 1000)
    return () => clearInterval(t)
  }, [])

  const isMac =
    typeof navigator !== "undefined" && /mac/i.test(navigator.platform || navigator.userAgent)

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 font-mono text-[8px] text-hud-cyan/25 tracking-widest">
        <span>SECURE CHANNEL · AES-256-GCM</span>
        <span className="text-hud-cyan/15">|</span>
        <span className="tabular-nums">SESSION {fmt(uptime)}</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setCommandOpen(true)}
          className="group flex items-center gap-1.5"
          aria-label="Open command palette"
        >
          <span className="font-mono text-[8px] tracking-widest text-hud-cyan/30 group-hover:text-hud-cyan/70 transition-colors">
            COMMANDS
          </span>
          <kbd className="font-mono text-[8px] tracking-widest text-hud-cyan/45 group-hover:text-hud-cyan border border-hud-cyan/20 group-hover:border-hud-cyan/45 rounded-sm px-1.5 py-0.5 transition-colors">
            {isMac ? "⌘" : "CTRL"} K
          </kbd>
        </button>
        <span className="font-mono text-[8px] text-hud-cyan/25 tracking-widest animate-hud-flicker">
          LIVEKIT BRIDGE · MCP ACTIVE
        </span>
      </div>
    </div>
  )
}
