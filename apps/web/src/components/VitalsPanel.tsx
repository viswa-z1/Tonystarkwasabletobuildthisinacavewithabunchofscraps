import { useEffect, useRef, useState } from "react"

interface Vital {
  label: string
  /** 0–100 */
  value: number
  unit: string
}

const SEED: Vital[] = [
  { label: "CPU LOAD", value: 34, unit: "%" },
  { label: "MEMORY",   value: 58, unit: "%" },
  { label: "NETWORK",  value: 72, unit: "Mb" },
  { label: "POWER",    value: 91, unit: "%" },
]

/** Pick a colour by load: green < 60, amber < 85, red otherwise. */
function colorFor(v: number) {
  if (v < 60) return "#00ff88"
  if (v < 85) return "#ffb300"
  return "#ff3366"
}

/** Random-walk a value, clamped to [8, 99]. */
function drift(v: number, span: number) {
  const next = v + (Math.random() - 0.5) * span
  return Math.max(8, Math.min(99, next))
}

/**
 * Simulated live system telemetry — CPU / MEM / NET / PWR bar meters that
 * random-walk every second with colour thresholds.
 */
export default function VitalsPanel() {
  const [vitals, setVitals] = useState<Vital[]>(SEED)
  const ref = useRef(SEED.map((v) => v.value))

  useEffect(() => {
    const t = setInterval(() => {
      ref.current = ref.current.map((v) => drift(v, 14))
      setVitals((prev) => prev.map((v, i) => ({ ...v, value: Math.round(ref.current[i]) })))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-3">
      <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">SYSTEM VITALS</p>

      {vitals.map((v) => {
        const c = colorFor(v.value)
        return (
          <div key={v.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-mono text-[9px] tracking-widest">
              <span className="text-hud-cyan/50">{v.label}</span>
              <span style={{ color: c }} className="tabular-nums">
                {v.value}
                {v.unit}
              </span>
            </div>
            <div className="h-1 w-full bg-hud-cyan/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${v.value}%`, background: c, boxShadow: `0 0 6px ${c}` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
