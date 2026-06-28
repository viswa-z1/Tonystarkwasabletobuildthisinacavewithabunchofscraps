import { useEffect, useRef, useState } from "react"
import { toast } from "@/stores/toastStore"

type Mode = "focus" | "break"

const DURATION: Record<Mode, number> = {
  focus: 25 * 60,
  break: 5 * 60,
}

const COLOR: Record<Mode, string> = {
  focus: "#00d4ff",
  break: "#00ff88",
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
}

const R = 34
const C = 2 * Math.PI * R

/**
 * Focus / break timer with an SVG ring that depletes as time runs down.
 * Controls are labelled buttons; the remaining time is announced politely for
 * screen readers. Motion here is feedback (state of the countdown), so it is
 * kept regardless of the motion preference.
 */
export default function FocusTimer() {
  const [mode, setMode] = useState<Mode>("focus")
  const [left, setLeft] = useState(DURATION.focus)
  const [running, setRunning] = useState(false)
  const tick = useRef<number | null>(null)

  useEffect(() => {
    if (!running) return
    tick.current = window.setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          const nextMode: Mode = mode === "focus" ? "break" : "focus"
          setMode(nextMode)
          setRunning(false)
          toast.success(mode === "focus" ? "Focus block done, take a break" : "Break over, back to it")
          return DURATION[nextMode]
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (tick.current) clearInterval(tick.current)
    }
  }, [running, mode])

  const reset = () => {
    setRunning(false)
    setLeft(DURATION[mode])
  }

  const remaining = left / DURATION[mode]
  const color = COLOR[mode]

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">FOCUS TIMER</p>
        <span className="font-mono text-[8px] tracking-widest" style={{ color }}>
          {mode === "focus" ? "DEEP WORK" : "RECOVER"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" style={{ width: 84, height: 84 }}>
          <svg width={84} height={84} className="-rotate-90">
            <circle cx={42} cy={42} r={R} fill="none" stroke="#00d4ff18" strokeWidth={3} />
            <circle
              cx={42}
              cy={42}
              r={R}
              fill="none"
              stroke={color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - remaining)}
              style={{ transition: "stroke-dashoffset 0.5s linear", filter: `drop-shadow(0 0 4px ${color}88)` }}
            />
          </svg>
          <div
            className="absolute inset-0 flex items-center justify-center font-display text-sm tracking-widest tabular-nums"
            style={{ color }}
            aria-live="polite"
          >
            {fmt(left)}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1">
          <button
            onClick={() => setRunning((r) => !r)}
            className="font-mono text-[9px] tracking-widest border px-3 py-1.5 rounded-sm transition-colors"
            style={{ borderColor: `${color}55`, color }}
          >
            {running ? "PAUSE" : "START"}
          </button>
          <button
            onClick={reset}
            aria-label="Reset timer"
            className="font-mono text-[9px] tracking-widest border border-hud-cyan/20 text-hud-cyan/50 hover:text-hud-cyan px-3 py-1.5 rounded-sm transition-colors"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  )
}
