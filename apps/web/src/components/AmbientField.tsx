import { useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

/**
 * Low-contrast drifting particle field behind the HUD. Motivation: ambient
 * depth, nothing more, so it renders a single still frame when motion is
 * reduced. Kept dim (alpha well under 0.2) to avoid neon-glow slop.
 */
export default function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef(0)
  const reduce    = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    let W = 0
    let H = 0
    let particles: Particle[] = []

    const seed = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      const count = Math.min(70, Math.round((W * H) / 26000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 0.6 + Math.random() * 1.4,
        a: 0.04 + Math.random() * 0.12,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        if (!reduce) {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = W
          if (p.x > W) p.x = 0
          if (p.y < 0) p.y = H
          if (p.y > H) p.y = 0
        }
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.a})`
        ctx.fill()
      }
      if (!reduce) rafRef.current = requestAnimationFrame(draw)
    }

    seed()
    draw()

    const onResize = () => seed()
    window.addEventListener("resize", onResize)
    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(rafRef.current)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
      aria-hidden
    />
  )
}
