import { useEffect, useRef } from "react"
import anime from "animejs"

export type OrbState = "idle" | "listening" | "thinking" | "speaking"

interface Props {
  state: OrbState
  onClick?: () => void
}

const STATE_THEME: Record<OrbState, { color: string; glow: string; speed: number }> = {
  idle:      { color: "#00d4ff", glow: "#00d4ff33", speed: 2400 },
  listening: { color: "#ffb300", glow: "#ffb30033", speed: 900 },
  thinking:  { color: "#00d4ff", glow: "#00d4ff33", speed: 1600 },
  speaking:  { color: "#00ff88", glow: "#00ff8833", speed: 600 },
}

export default function VoiceOrb({ state, onClick }: Props) {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const coreRef  = useRef<HTMLDivElement>(null)
  const ring1Ref = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const ring3Ref = useRef<HTMLDivElement>(null)
  const anims    = useRef<anime.AnimeInstance[]>([])

  // Boot entrance
  useEffect(() => {
    if (!wrapRef.current) return
    anime({
      targets: wrapRef.current,
      scale: [0.4, 1],
      opacity: [0, 1],
      duration: 1000,
      easing: "easeOutElastic(1, .65)",
    })
  }, [])

  // State-driven animations
  useEffect(() => {
    anims.current.forEach((a) => a.pause())
    anims.current = []

    const theme = STATE_THEME[state]

    // Core breathe
    const core = anime({
      targets: coreRef.current,
      scale: [1, state === "speaking" ? 1.14 : 1.06, 1],
      duration: theme.speed,
      easing: "easeInOutSine",
      loop: true,
    })

    // Rings pulse outward
    const r1 = anime({
      targets: ring1Ref.current,
      scale: [1, 2],
      opacity: [0.6, 0],
      duration: theme.speed * 1.4,
      easing: "easeOutQuart",
      loop: true,
    })
    const r2 = anime({
      targets: ring2Ref.current,
      scale: [1, 2],
      opacity: [0.4, 0],
      duration: theme.speed * 1.4,
      delay: theme.speed * 0.45,
      easing: "easeOutQuart",
      loop: true,
    })
    const r3 = anime({
      targets: ring3Ref.current,
      scale: [1, 2],
      opacity: [0.25, 0],
      duration: theme.speed * 1.4,
      delay: theme.speed * 0.9,
      easing: "easeOutQuart",
      loop: true,
    })

    anims.current = [core, r1, r2, r3]

    // Colour & glow transition on core
    if (coreRef.current) {
      const el = coreRef.current as HTMLElement
      el.style.transition = "border-color 0.5s, box-shadow 0.5s"
      el.style.borderColor = theme.color
      el.style.boxShadow   = `0 0 28px ${theme.glow}, 0 0 60px ${theme.glow}, inset 0 0 20px ${theme.glow}`
    }
    ;[ring1Ref, ring2Ref, ring3Ref].forEach((r) => {
      if (r.current) {
        const el = r.current as HTMLElement
        el.style.transition = "border-color 0.5s"
        el.style.borderColor = theme.color
      }
    })
  }, [state])

  const theme = STATE_THEME[state]

  return (
    <div
      ref={wrapRef}
      onClick={onClick}
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{ width: 180, height: 180 }}
    >
      {/* Pulse rings */}
      {[ring1Ref, ring2Ref, ring3Ref].map((r, i) => (
        <div
          key={i}
          ref={r}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: theme.color }}
        />
      ))}

      {/* Core orb */}
      <div
        ref={coreRef}
        className="absolute rounded-full flex flex-col items-center justify-center gap-1"
        style={{
          width: 120,
          height: 120,
          background: `radial-gradient(circle at 38% 32%, ${theme.color}22, #000a14 68%)`,
          border: `1.5px solid ${theme.color}`,
          boxShadow: `0 0 28px ${theme.glow}, 0 0 60px ${theme.glow}, inset 0 0 20px ${theme.glow}`,
        }}
      >
        <span
          className="font-display text-[8px] tracking-[0.3em] uppercase"
          style={{ color: theme.color }}
        >
          FRIDAY
        </span>
        <span
          className="font-mono text-[9px] tracking-widest uppercase opacity-70"
          style={{ color: theme.color }}
        >
          {state}
        </span>
      </div>
    </div>
  )
}
