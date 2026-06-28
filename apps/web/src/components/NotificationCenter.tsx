import { useEffect, useState } from "react"
import { useToastStore, type ToastKind } from "@/stores/toastStore"

const COLOR: Record<ToastKind, string> = {
  info: "#00d4ff",
  success: "#00ff88",
  warn: "#ffb300",
  error: "#ff3366",
}

const TAG: Record<ToastKind, string> = {
  info: "INFO",
  success: "OK",
  warn: "WARN",
  error: "ALERT",
}

/** Compact relative time: "now", "3m", "2h", then a clock for older entries. */
function ago(at: number, now: number) {
  const s = Math.floor((now - at) / 1000)
  if (s < 10) return "now"
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h`
  return new Date(at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}

/**
 * Recent alerts history. Every toast is recorded here so a dismissed alert is
 * still recoverable. Carries an explicit empty state and a clear action.
 */
export default function NotificationCenter() {
  const history = useToastStore((s) => s.history)
  const clear = useToastStore((s) => s.clearHistory)
  const [now, setNow] = useState(() => Date.now())

  // Keep relative timestamps fresh without animating anything.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 15000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">ALERTS</p>
        {history.length > 0 && (
          <button
            onClick={clear}
            className="font-mono text-[8px] tracking-widest text-hud-cyan/35 hover:text-hud-cyan transition-colors"
          >
            CLEAR
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="font-mono text-[10px] tracking-widest text-hud-cyan/25 py-1">NO ALERTS YET</p>
      ) : (
        <div className="flex flex-col max-h-40 overflow-y-auto pr-1">
          {history.map((r, i) => (
            <div key={r.id} className={`flex items-start gap-2 py-1.5 ${i === 0 ? "" : "border-t border-hud-cyan/8"}`}>
              <span className="font-mono text-[8px] tracking-widest shrink-0 pt-0.5 w-8" style={{ color: COLOR[r.kind] }}>
                {TAG[r.kind]}
              </span>
              <span className="font-mono text-[9px] leading-snug text-hud-cyan/70 flex-1">{r.message}</span>
              <span className="font-mono text-[8px] tabular-nums text-hud-cyan/30 shrink-0 pt-0.5">{ago(r.at, now)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
