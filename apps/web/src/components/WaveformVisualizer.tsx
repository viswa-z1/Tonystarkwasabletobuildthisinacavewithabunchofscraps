import { useEffect, useRef } from "react"
import { OrbState } from "./VoiceOrb"

interface Props {
  state: OrbState
}

const COLORS: Record<OrbState, string> = {
  idle:      "#00d4ff",
  listening: "#ffb300",
  thinking:  "#00d4ff",
  speaking:  "#00ff88",
}

const AMPLITUDES: Record<OrbState, () => number> = {
  idle:      () => 2 + Math.random() * 1.5,
  listening: () => 6 + Math.random() * 10,
  thinking:  () => 3 + Math.sin(Date.now() / 300) * 4,
  speaking:  () => 8 + Math.random() * 20,
}

export default function WaveformVisualizer({ state }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef(0)
  const phaseRef  = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const W = canvas.width
    const H = canvas.height
    const BARS = 48
    const GAP  = 2
    const barW = (W - (BARS - 1) * GAP) / BARS

    function draw() {
      ctx.clearRect(0, 0, W, H)
      const color = COLORS[state]

      for (let i = 0; i < BARS; i++) {
        const phase = phaseRef.current + i * 0.28
        const base = AMPLITUDES[state]()
        const amp  = base * (0.6 + 0.4 * Math.abs(Math.sin(phase)))
        const barH = Math.max(2, amp)
        const x    = i * (barW + GAP)
        const y    = (H - barH) / 2

        const ratio = barH / (H / 2)
        ctx.fillStyle = color
        ctx.globalAlpha = 0.3 + ratio * 0.65
        ctx.shadowColor = color
        ctx.shadowBlur  = ratio > 0.4 ? 8 : 3
        ctx.fillRect(x, y, barW, barH)
      }

      const speeds: Record<OrbState, number> = {
        idle:      0.03,
        listening: 0.09,
        thinking:  0.05,
        speaking:  0.16,
      }
      phaseRef.current += speeds[state]
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [state])

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={52}
      className="opacity-90"
      style={{ display: "block" }}
    />
  )
}
