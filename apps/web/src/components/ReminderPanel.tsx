import { useEffect, useState } from "react"
import { toast } from "@/stores/toastStore"

interface Reminder {
  id: string
  text: string
  done: boolean
}

const KEY = "friday.reminders"

const DEFAULTS: Reminder[] = [
  { id: "r1", text: "Brief Pepper on the Q3 numbers", done: false },
  { id: "r2", text: "Run diagnostics on the Mark VII", done: false },
  { id: "r3", text: "Order more shawarma", done: true },
]

function load(): Reminder[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Reminder[]
  } catch {
    /* ignore */
  }
  return DEFAULTS
}

/**
 * Persistent reminder queue — the UI counterpart to the set_reminder MCP tool.
 * Add with Enter, click to toggle done; state survives reloads via localStorage.
 */
export default function ReminderPanel() {
  const [items, setItems] = useState<Reminder[]>(load)
  const [draft, setDraft] = useState("")

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {
      /* ignore */
    }
  }, [items])

  const add = () => {
    const text = draft.trim()
    if (!text) return
    setItems((prev) => [{ id: crypto.randomUUID(), text, done: false }, ...prev])
    setDraft("")
    toast.info(`Reminder set: ${text}`)
  }

  const toggle = (id: string) =>
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)))

  const remove = (id: string) => setItems((prev) => prev.filter((r) => r.id !== id))

  const pending = items.filter((r) => !r.done).length

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">REMINDERS</p>
        <span className="font-mono text-[8px] tracking-widest text-hud-green">{pending} PENDING</span>
      </div>

      <div className="flex items-center gap-2 border-b border-hud-cyan/12 pb-2">
        <span className="font-mono text-[10px] text-hud-cyan/40">+</span>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="ADD REMINDER..."
          className="flex-1 bg-transparent outline-none font-mono text-[10px] tracking-wide text-hud-cyan placeholder:text-hud-cyan/25"
        />
      </div>

      <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="font-mono text-[10px] tracking-widest text-hud-cyan/25">NO REMINDERS</p>
        ) : (
          items.map((r) => (
            <div key={r.id} className="group flex items-center gap-2">
              <button
                onClick={() => toggle(r.id)}
                aria-label={r.done ? "Mark incomplete" : "Mark complete"}
                className="w-3 h-3 shrink-0 border flex items-center justify-center"
                style={{
                  borderColor: r.done ? "#00ff88" : "#00d4ff55",
                  background: r.done ? "#00ff8822" : "transparent",
                }}
              >
                {r.done && <span className="text-[8px] text-hud-green leading-none">✓</span>}
              </button>
              <span
                className={`flex-1 font-mono text-[10px] tracking-wide leading-snug ${
                  r.done ? "text-hud-cyan/30 line-through" : "text-hud-cyan/75"
                }`}
              >
                {r.text}
              </span>
              <button
                onClick={() => remove(r.id)}
                aria-label="Delete reminder"
                className="opacity-0 group-hover:opacity-100 font-mono text-[10px] text-hud-red/60 hover:text-hud-red transition-opacity"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
