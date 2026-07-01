import { useEffect, useRef, useState } from "react"
import { usePrefsStore } from "@/stores/prefsStore"

function pad(n: number) {
  return n.toString().padStart(2, "0")
}

function fmtUptime(ms: number) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  return `${pad(h)}:${pad(m)}:${pad(s % 60)}`
}

/**
 * Live local time / date readout plus a session-uptime counter that ticks from
 * the moment the panel mounts.
 */
export default function ClockPanel() {
  const [now, setNow] = useState(() => new Date())
  const mountedAt = useRef(Date.now())
  const clock24 = usePrefsStore((s) => s.clock24)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const h24 = now.getHours()
  const suffix = clock24 ? "" : h24 >= 12 ? " PM" : " AM"
  const h = clock24 ? h24 : h24 % 12 || 12
  const time = `${pad(h)}:${pad(now.getMinutes())}:${pad(now.getSeconds())}${suffix}`
  const date = now
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" })
    .toUpperCase()
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone.toUpperCase()

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-2">
      <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">LOCAL TIME</p>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-2xl tracking-[0.18em] text-hud-cyan glow-cyan tabular-nums">
          {time}
        </span>
      </div>

      <div className="flex items-center justify-between font-mono text-[8px] tracking-widest text-hud-cyan/45">
        <span>{date}</span>
        <span className="text-hud-cyan/30">{tz}</span>
      </div>

      <div className="flex items-center justify-between border-t border-hud-cyan/8 pt-2 mt-1 font-mono text-[8px] tracking-widest">
        <span className="text-hud-cyan/40">UPTIME</span>
        <span className="text-hud-green tabular-nums">{fmtUptime(now.getTime() - mountedAt.current)}</span>
      </div>
    </div>
  )
}
