import { useEffect, useRef, useState } from "react"

const SAMPLES = 44
const W = 248
const H = 40

/** Drift a latency reading with the occasional spike, clamped to a sane band. */
function nextLatency(prev: number) {
  const spike = Math.random() < 0.07 ? 18 + Math.random() * 26 : 0
  const v = prev + (Math.random() - 0.5) * 7 + spike - prev * 0.04 + 47 * 0.04
  return Math.max(18, Math.min(140, v))
}

/**
 * Round-trip latency sparkline. Values drift organically (no fake-perfect
 * numbers) and the panel reports live current / min / avg / max in ms.
 */
export default function LatencySparkline() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const samples = useRef<number[]>(
    Array.from({ length: SAMPLES }, () => 40 + Math.random() * 16)
  )
  const [stats, setStats] = useState({ cur: 47.2, min: 41, max: 58, avg: 47 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!
    const cyan = "#00d4ff"

    const draw = () => {
      const data = samples.current
      const min = Math.min(...data)
      const max = Math.max(...data)
      const range = Math.max(1, max - min)
      const xStep = W / (SAMPLES - 1)
      const yOf = (v: number) => H - 4 - ((v - min) / range) * (H - 8)

      ctx.clearRect(0, 0, W, H)

      // Filled area
      ctx.beginPath()
      ctx.moveTo(0, H)
      data.forEach((v, i) => ctx.lineTo(i * xStep, yOf(v)))
      ctx.lineTo(W, H)
      ctx.closePath()
      ctx.fillStyle = `${cyan}14`
      ctx.fill()

      // Line
      ctx.beginPath()
      data.forEach((v, i) => (i === 0 ? ctx.moveTo(0, yOf(v)) : ctx.lineTo(i * xStep, yOf(v))))
      ctx.strokeStyle = cyan
      ctx.lineWidth = 1.25
      ctx.shadowColor = cyan
      ctx.shadowBlur = 4
      ctx.stroke()
      ctx.shadowBlur = 0

      // Leading dot
      const lx = (SAMPLES - 1) * xStep
      const ly = yOf(data[SAMPLES - 1])
      ctx.beginPath()
      ctx.arc(lx, ly, 2, 0, Math.PI * 2)
      ctx.fillStyle = "#00ff88"
      ctx.fill()
    }

    const tick = () => {
      const data = samples.current
      data.push(nextLatency(data[data.length - 1]))
      data.shift()
      draw()
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      setStats({
        cur: +data[data.length - 1].toFixed(1),
        min: Math.round(Math.min(...data)),
        max: Math.round(Math.max(...data)),
        avg: Math.round(avg),
      })
    }

    draw()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">GATEWAY LATENCY</p>
        <span className="font-mono text-[10px] tabular-nums text-hud-green glow-green">{stats.cur}ms</span>
      </div>
      <canvas ref={canvasRef} width={W} height={H} className="w-full" style={{ display: "block" }} />
      <div className="grid grid-cols-3 gap-2 font-mono text-[8px] tracking-widest text-hud-cyan/45 tabular-nums">
        <span>MIN {stats.min}ms</span>
        <span className="text-center">AVG {stats.avg}ms</span>
        <span className="text-right">MAX {stats.max}ms</span>
      </div>
    </div>
  )
}
