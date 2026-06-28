import { useEffect, useRef, useState } from "react"
import anime from "animejs"
import { useReducedMotion } from "@/hooks/useReducedMotion"

interface Quote {
  sym: string
  price: number
  change: number
}

const SEED: Quote[] = [
  { sym: "STARK", price: 642.18, change: 2.4 },
  { sym: "AAPL",  price: 228.5,  change: 0.8 },
  { sym: "NVDA",  price: 131.2,  change: 3.1 },
  { sym: "TSLA",  price: 251.7,  change: -1.6 },
  { sym: "BTC",   price: 67230,  change: 1.2 },
  { sym: "ETH",   price: 3512,   change: -0.5 },
  { sym: "GOLD",  price: 2412,   change: 0.3 },
  { sym: "OIL",   price: 78.4,   change: -2.1 },
]

/** Random-walk both price and change so the tape feels alive. */
function tick(q: Quote): Quote {
  const change = +(q.change + (Math.random() - 0.5) * 0.6).toFixed(2)
  const price = +(q.price * (1 + (Math.random() - 0.5) * 0.004)).toFixed(q.price > 1000 ? 0 : 2)
  return { ...q, price, change }
}

/**
 * Finance tape scrolling beneath the news ticker. Prices random-walk every
 * couple seconds; deltas are coloured green (up) / red (down).
 */
export default function StockTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [quotes, setQuotes] = useState<Quote[]>(SEED)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const anim = anime({
      targets: trackRef.current,
      translateX: ["-50%", "0%"],
      duration: 44000,
      easing: "linear",
      loop: true,
    })
    return () => anim.pause()
  }, [reduce])

  useEffect(() => {
    const t = setInterval(() => setQuotes((prev) => prev.map(tick)), 2200)
    return () => clearInterval(t)
  }, [])

  const Item = ({ q }: { q: Quote }) => {
    const up = q.change >= 0
    const color = up ? "#00ff88" : "#ff3366"
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest whitespace-nowrap mr-6">
        <span className="text-hud-cyan/70">{q.sym}</span>
        <span className="text-hud-cyan/45 tabular-nums">{q.price.toLocaleString()}</span>
        <span style={{ color }} className="tabular-nums">
          {up ? "▲" : "▼"} {Math.abs(q.change).toFixed(2)}%
        </span>
      </span>
    )
  }

  return (
    <div className="flex items-stretch border border-hud-cyan/15 bg-hud-cyan/[0.03] rounded-sm overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 bg-hud-green/10 border-r border-hud-green/30 shrink-0">
        <span className="font-mono text-[9px] tracking-[0.25em] text-hud-green">MKT</span>
      </div>
      <div className="relative flex-1 overflow-hidden py-1.5">
        <div ref={trackRef} className="flex w-max">
          {[...quotes, ...quotes].map((q, i) => (
            <Item key={`${q.sym}-${i}`} q={q} />
          ))}
        </div>
      </div>
    </div>
  )
}
