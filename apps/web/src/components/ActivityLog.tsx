import { useEffect, useRef, useState } from "react"

type Level = "ok" | "info" | "warn"

interface Event {
  id: number
  t: string
  level: Level
  text: string
}

const POOL: { level: Level; text: string }[] = [
  { level: "ok",   text: "MCP tool get_world_news resolved in 312ms" },
  { level: "info", text: "STT partial transcript flushed to LLM" },
  { level: "ok",   text: "TTS stream nova warmed, buffer primed" },
  { level: "info", text: "LiveKit room renegotiated audio track" },
  { level: "warn", text: "Gemini token budget at 71.4 percent" },
  { level: "ok",   text: "get_weather cache hit, skipped fetch" },
  { level: "info", text: "Reminder synced to local store" },
  { level: "ok",   text: "Heartbeat ack from gateway, rtt 47.2ms" },
  { level: "warn", text: "Redis pool nearing soft limit at 83 conns" },
  { level: "ok",   text: "Session checkpoint written" },
]

const LEVEL_COLOR: Record<Level, string> = {
  ok: "#00ff88",
  info: "#00d4ff",
  warn: "#ffb300",
}

function stamp(d: Date) {
  const p = (n: number) => n.toString().padStart(2, "0")
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

let nextId = 1

/**
 * Streaming system event feed. Hairline rows (one divider, never doubled),
 * monospace, organic timestamps and latencies. Shows an explicit empty state
 * until the first event lands.
 */
export default function ActivityLog() {
  const [events, setEvents] = useState<Event[]>([])
  const idx = useRef(Math.floor(Math.random() * POOL.length))

  useEffect(() => {
    const push = () => {
      const item = POOL[idx.current % POOL.length]
      idx.current += 1 + Math.floor(Math.random() * 2)
      setEvents((prev) => [{ id: nextId++, t: stamp(new Date()), ...item }, ...prev].slice(0, 7))
    }
    push()
    const interval = setInterval(push, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">ACTIVITY LOG</p>
        <span className="font-mono text-[8px] tracking-widest text-hud-cyan/30">{events.length} EVENTS</span>
      </div>

      {events.length === 0 ? (
        <p className="font-mono text-[10px] tracking-widest text-hud-cyan/25 animate-hud-blink py-1">
          AWAITING EVENTS...
        </p>
      ) : (
        <div className="flex flex-col">
          {events.map((e, i) => (
            <div
              key={e.id}
              className={`flex items-start gap-2 py-1.5 ${i === 0 ? "" : "border-t border-hud-cyan/8"}`}
            >
              <span className="font-mono text-[8px] tabular-nums text-hud-cyan/35 pt-0.5 shrink-0">{e.t}</span>
              <span
                className="w-1 h-1 rounded-full mt-1.5 shrink-0"
                style={{ background: LEVEL_COLOR[e.level], boxShadow: `0 0 4px ${LEVEL_COLOR[e.level]}` }}
              />
              <span className="font-mono text-[9px] leading-snug text-hud-cyan/70">{e.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
