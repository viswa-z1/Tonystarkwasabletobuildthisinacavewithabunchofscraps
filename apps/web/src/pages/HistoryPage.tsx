import { useEffect, useRef } from "react"
import anime from "animejs"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Session {
  id: string
  date: string
  duration: string
  messages: number
  summary: string
}

const SESSIONS: Session[] = [
  { id: "1", date: "2026-06-14 · 00:12", duration: "14m", messages: 28, summary: "World news brief, finance market update, weather check" },
  { id: "2", date: "2026-06-13 · 21:45", duration: "9m",  messages: 18, summary: "System diagnostics and stock market summary" },
  { id: "3", date: "2026-06-13 · 18:30", duration: "6m",  messages: 12, summary: "Evening briefing — global headlines" },
  { id: "4", date: "2026-06-12 · 10:05", duration: "22m", messages: 44, summary: "Deep dive on geopolitical events and finance outlook" },
]

export default function HistoryPage() {
  const listRef  = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    anime({
      targets: headerRef.current,
      opacity: [0, 1],
      translateY: [-10, 0],
      duration: 500,
      easing: "easeOutCubic",
    })
    anime({
      targets: listRef.current?.querySelectorAll(".s-card"),
      opacity: [0, 1],
      translateX: [-28, 0],
      duration: 480,
      delay: anime.stagger(90, { start: 250 }),
      easing: "easeOutCubic",
    })
  }, [])

  return (
    <div
      className="fixed inset-0 hud-grid flex flex-col"
      style={{ background: "#000a14" }}
    >
      {/* Corner accents */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-hud-cyan/40" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-hud-cyan/40" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-hud-cyan/40" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-hud-cyan/40" />

      <div className="flex-1 overflow-y-auto p-8">
        {/* Header */}
        <div ref={headerRef} className="flex items-end justify-between mb-8 opacity-0">
          <div>
            <h1 className="font-display text-sm tracking-[0.35em] text-hud-cyan glow-cyan">
              SESSION HISTORY
            </h1>
            <p className="font-mono text-[9px] text-hud-cyan/30 tracking-widest mt-1.5">
              {SESSIONS.length} SESSIONS LOGGED · ENCRYPTED ARCHIVE
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
            ← BACK TO HUD
          </Button>
        </div>

        {/* Session cards */}
        <div ref={listRef} className="space-y-3 max-w-2xl mx-auto">
          {SESSIONS.map((s) => (
            <Card
              key={s.id}
              className="s-card opacity-0 cursor-pointer hover:border-hud-cyan/40 hover:glow-box-cyan transition-all duration-200"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-[9px] text-hud-cyan/40 tracking-widest mb-1.5">
                      {s.date}
                    </p>
                    <p className="font-mono text-xs text-hud-cyan/70 leading-relaxed">
                      {s.summary}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0 mt-0.5">
                    <Badge variant="green">{s.duration}</Badge>
                    <Badge variant="cyan">{s.messages} msg</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
