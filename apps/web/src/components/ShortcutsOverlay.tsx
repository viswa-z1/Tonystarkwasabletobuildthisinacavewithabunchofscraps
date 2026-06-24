import { useEffect, useRef, useState } from "react"
import anime from "animejs"

interface Shortcut {
  keys: string[]
  label: string
}

const SHORTCUTS: Shortcut[] = [
  { keys: ["⌘", "K"], label: "Open command palette" },
  { keys: ["Space"],  label: "Cycle F.R.I.D.A.Y. voice state" },
  { keys: ["?"],      label: "Toggle this shortcuts sheet" },
  { keys: ["Esc"],    label: "Dismiss any overlay" },
  { keys: ["H"],      label: "Jump to session history" },
]

function isTyping(el: EventTarget | null) {
  const node = el as HTMLElement | null
  if (!node) return false
  const tag = node.tagName
  return tag === "INPUT" || tag === "TEXTAREA" || node.isContentEditable
}

/**
 * Press "?" anywhere (outside a text field) to reveal a keyboard cheat-sheet.
 * Esc or another "?" dismisses it.
 */
export default function ShortcutsOverlay() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      else if (e.key === "?" && !isTyping(e.target)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open)
      anime({ targets: panelRef.current, opacity: [0, 1], scale: [0.96, 1], duration: 240, easing: "easeOutCubic" })
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        className="glass-panel rounded-sm w-[min(92vw,420px)] border-hud-cyan/30 glow-box-cyan p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-[10px] tracking-[0.3em] text-hud-cyan glow-cyan">KEYBOARD SHORTCUTS</h2>
          <span className="font-mono text-[8px] tracking-widest text-hud-cyan/30">PRESS ? TO CLOSE</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {SHORTCUTS.map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <span className="font-mono text-[11px] tracking-wide text-hud-cyan/70">{s.label}</span>
              <span className="flex items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="font-mono text-[9px] tracking-widest text-hud-cyan/80 border border-hud-cyan/25 bg-hud-cyan/5 rounded-sm px-1.5 py-0.5 min-w-[20px] text-center"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
