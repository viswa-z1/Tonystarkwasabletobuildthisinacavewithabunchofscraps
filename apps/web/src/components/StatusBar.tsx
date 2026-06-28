import { useEffect, useRef } from "react"
import anime from "animejs"
import { Badge } from "@/components/ui/badge"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const SERVICES = [
  { label: "STT", variant: "green" },
  { label: "LLM", variant: "green" },
  { label: "TTS", variant: "green" },
  { label: "MCP", variant: "cyan"  },
] as const

function BlinkDot({ color }: { color: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const anim = anime({
      targets: ref.current,
      opacity: [1, 0.15, 1],
      duration: 2200,
      easing: "easeInOutSine",
      loop: true,
      delay: Math.random() * 1000,
    })
    return () => anim.pause()
  }, [reduce])
  return (
    <span
      ref={ref}
      className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
      style={{ background: color, boxShadow: `0 0 5px ${color}` }}
    />
  )
}

export default function StatusBar() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    anime({
      targets: barRef.current?.querySelectorAll(".sb-item"),
      opacity: [0, 1],
      translateY: [6, 0],
      duration: 450,
      delay: anime.stagger(80, { start: 600 }),
      easing: "easeOutCubic",
    })
  }, [])

  const dotColor: Record<string, string> = { green: "#00ff88", cyan: "#00d4ff" }

  return (
    <div ref={barRef} className="flex items-center gap-2 flex-wrap">
      {SERVICES.map((s) => (
        <Badge key={s.label} variant={s.variant} className="sb-item opacity-0">
          <BlinkDot color={dotColor[s.variant]} />
          {s.label}: ONLINE
        </Badge>
      ))}
    </div>
  )
}
