import { useEffect, useState } from "react"

interface Zone {
  label: string
  tz: string
}

const ZONES: Zone[] = [
  { label: "SF", tz: "America/Los_Angeles" },
  { label: "LON", tz: "Europe/London" },
  { label: "TOK", tz: "Asia/Tokyo" },
]

function parts(date: Date, tz: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  })
  const map: Record<string, string> = {}
  for (const p of fmt.formatToParts(date)) map[p.type] = p.value
  const hour = Number(map.hour)
  return {
    time: `${map.hour}:${map.minute}`,
    day: (map.weekday ?? "").toUpperCase(),
    night: hour < 6 || hour >= 19,
  }
}

/**
 * World clocks for the operator's working timezones. Computed with Intl so
 * there is no offset math to drift; a sun/moon glyph marks local day or night.
 */
export default function WorldClocks() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-3">
      <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">WORLD CLOCKS</p>
      <div className="grid grid-cols-3 gap-2">
        {ZONES.map((z) => {
          const p = parts(now, z.tz)
          return (
            <div key={z.label} className="flex flex-col items-center gap-0.5">
              <span className="font-mono text-[8px] tracking-widest text-hud-cyan/40">{z.label}</span>
              <span className="font-display text-sm tabular-nums text-hud-cyan glow-cyan leading-none">
                {p.time}
              </span>
              <span className="font-mono text-[8px] tracking-widest text-hud-cyan/35">
                <span aria-hidden className="mr-1">{p.night ? "☾" : "☀"}</span>
                {p.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
