import { useEffect, useRef } from "react"

interface Blip {
  /** angle in radians */
  a: number
  /** normalized radius 0–1 */
  r: number
  /** brightness 0–1, decays after the sweep lights it up */
  lit: number
}

/**
 * Rotating radar sweep with contacts that flare as the beam passes over them —
 * the F.R.I.D.A.Y. "targeting" widget. Canvas-rendered for cheap 60fps.
 */
export default function RadarSweep({ size = 168 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef(0)
  const angleRef  = useRef(0)
  const blipsRef  = useRef<Blip[]>(
    Array.from({ length: 5 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.25 + Math.random() * 0.7,
      lit: 0,
    }))
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2
    const R = Math.min(cx, cy) - 4
    const cyan = "#00d4ff"

    function draw() {
      ctx.clearRect(0, 0, W, H)

      // Rings + crosshair
      ctx.strokeStyle = `${cyan}33`
      ctx.lineWidth = 1
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, (R * i) / 3, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy)
      ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R)
      ctx.stroke()

      // Sweep wedge
      const a = angleRef.current
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      grad.addColorStop(0, `${cyan}55`)
      grad.addColorStop(1, `${cyan}00`)
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, a - 0.5, a)
      ctx.closePath()
      ctx.fillStyle = grad
      ctx.fill()
      ctx.restore()

      // Leading edge line
      ctx.strokeStyle = `${cyan}cc`
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R)
      ctx.stroke()

      // Blips
      for (const b of blipsRef.current) {
        // light up when the sweep passes near the blip angle
        let diff = Math.abs(((a - b.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
        diff = Math.PI - diff
        if (diff < 0.12) b.lit = 1
        b.lit = Math.max(0, b.lit - 0.012)

        const bx = cx + Math.cos(b.a) * R * b.r
        const by = cy + Math.sin(b.a) * R * b.r
        ctx.beginPath()
        ctx.arc(bx, by, 2 + b.lit * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 136, ${0.15 + b.lit * 0.85})`
        ctx.shadowColor = "#00ff88"
        ctx.shadowBlur = b.lit * 10
        ctx.fill()
        ctx.shadowBlur = 0
      }

      angleRef.current += 0.025
      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col items-center gap-2">
      <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40 self-start">
        PROXIMITY SCAN
      </p>
      <canvas ref={canvasRef} width={size} height={size} style={{ display: "block" }} />
      <div className="flex items-center justify-between w-full font-mono text-[8px] tracking-widest text-hud-cyan/40">
        <span>RANGE 5KM</span>
        <span className="text-hud-green">5 CONTACTS</span>
      </div>
    </div>
  )
}
