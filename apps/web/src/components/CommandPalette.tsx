import { useEffect, useMemo, useRef, useState } from "react"
import anime from "animejs"
import { useNavigate } from "react-router-dom"
import { useUIStore } from "@/stores/uiStore"
import { usePrefsStore } from "@/stores/prefsStore"

interface Command {
  id: string
  label: string
  hint: string
  run: (nav: ReturnType<typeof useNavigate>) => void
}

const COMMANDS: Command[] = [
  { id: "dash",    label: "Go to Dashboard",   hint: "NAV", run: (nav) => nav("/") },
  { id: "hist",    label: "Go to History",     hint: "NAV", run: (nav) => nav("/history") },
  { id: "login",   label: "Go to Login",       hint: "NAV", run: (nav) => nav("/login") },
  { id: "listen",  label: "Activate F.R.I.D.A.Y.", hint: "VOICE", run: () => useUIStore.getState().setOrbState("listening") },
  { id: "idle",    label: "Stand Down",        hint: "VOICE", run: () => useUIStore.getState().setOrbState("idle") },
  { id: "map-on",  label: "Show World Map",     hint: "HUD", run: () => useUIStore.getState().setShowWorldMap(true) },
  { id: "map-off", label: "Hide World Map",     hint: "HUD", run: () => useUIStore.getState().setShowWorldMap(false) },
  { id: "settings",  label: "Open Settings",        hint: "SYS",    run: () => useUIStore.getState().setSettingsOpen(true) },
  { id: "compact",   label: "Density: Compact",     hint: "VIEW",   run: () => usePrefsStore.getState().setDensity("compact") },
  { id: "comfort",   label: "Density: Comfortable", hint: "VIEW",   run: () => usePrefsStore.getState().setDensity("comfortable") },
  { id: "calm",      label: "Reduce Motion",        hint: "MOTION", run: () => usePrefsStore.getState().setMotionPref("reduced") },
  { id: "lively",    label: "Full Motion",          hint: "MOTION", run: () => usePrefsStore.getState().setMotionPref("full") },
]

/**
 * Cmd/Ctrl+K command launcher. Filterable, arrow-key navigable, Enter to run,
 * Esc to dismiss. Open state lives in the UI store so anything can trigger it.
 */
export default function CommandPalette() {
  const open = useUIStore((s) => s.commandOpen)
  const setOpen = useUIStore((s) => s.setCommandOpen)
  const toggle = useUIStore((s) => s.toggleCommand)
  const navigate = useNavigate()

  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return COMMANDS
    return COMMANDS.filter((c) => c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q))
  }, [query])

  // Global Cmd/Ctrl+K toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggle])

  // Reset + focus + entrance animation on open
  useEffect(() => {
    if (!open) return
    setQuery("")
    setActive(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    anime({ targets: panelRef.current, opacity: [0, 1], translateY: [-12, 0], scale: [0.98, 1], duration: 260, easing: "easeOutCubic" })
    return () => cancelAnimationFrame(id)
  }, [open])

  useEffect(() => {
    if (active >= results.length) setActive(results.length ? results.length - 1 : 0)
  }, [results, active])

  if (!open) return null

  const exec = (cmd?: Command) => {
    if (!cmd) return
    setOpen(false)
    cmd.run(navigate)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false)
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)) }
    else if (e.key === "ArrowUp")   { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    else if (e.key === "Enter")     { e.preventDefault(); exec(results[active]) }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh] bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        ref={panelRef}
        className="glass-panel rounded-sm w-[min(92vw,520px)] border-hud-cyan/30 glow-box-cyan"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-hud-cyan/15">
          <span className="font-mono text-[10px] text-hud-cyan/50">&gt;</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="TYPE A COMMAND..."
            className="flex-1 bg-transparent outline-none font-mono text-xs tracking-widest text-hud-cyan placeholder:text-hud-cyan/30"
          />
          <span className="font-mono text-[8px] tracking-widest text-hud-cyan/30 border border-hud-cyan/20 px-1.5 py-0.5">
            ESC
          </span>
        </div>

        <div className="max-h-[44vh] overflow-y-auto py-1">
          {results.length === 0 ? (
            <p className="px-4 py-3 font-mono text-[10px] tracking-widest text-hud-cyan/30">NO MATCHES</p>
          ) : (
            results.map((c, i) => (
              <button
                key={c.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => exec(c)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${
                  i === active ? "bg-hud-cyan/10" : "hover:bg-hud-cyan/5"
                }`}
              >
                <span className="font-mono text-[11px] tracking-wide text-hud-cyan/80">{c.label}</span>
                <span className="font-mono text-[8px] tracking-widest text-hud-cyan/35 border border-hud-cyan/15 px-1.5 py-0.5">
                  {c.hint}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
