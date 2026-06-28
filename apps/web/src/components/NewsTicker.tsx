import { useEffect, useRef } from "react"
import anime from "animejs"
import { useReducedMotion } from "@/hooks/useReducedMotion"

const HEADLINES = [
  "MARKETS RALLY AS TECH SECTOR LEADS GLOBAL GAINS",
  "STARK INDUSTRIES UNVEILS NEXT-GEN CLEAN ENERGY GRID",
  "ORBITAL TELEMETRY ARRAY ONLINE · COVERAGE NOMINAL",
  "WORLD LEADERS CONVENE ON AI SAFETY ACCORD",
  "MONSOON SYSTEM TRACKING NORTH-WEST OVER ARABIAN SEA",
  "QUANTUM COMPUTE MILESTONE: 1024 LOGICAL QUBITS STABLE",
]

/**
 * Bottom-edge scrolling world-news ticker. The headline track is duplicated so
 * the anime.js translateX loop wraps seamlessly.
 */
export default function NewsTicker() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const anim = anime({
      targets: trackRef.current,
      translateX: ["0%", "-50%"],
      duration: 38000,
      easing: "linear",
      loop: true,
    })
    return () => anim.pause()
  }, [reduce])

  const Item = ({ text }: { text: string }) => (
    <span className="inline-flex items-center font-mono text-[10px] tracking-widest text-hud-cyan/55 whitespace-nowrap">
      {text}
      <span className="mx-5 text-hud-amber/70">◆</span>
    </span>
  )

  return (
    <div className="flex items-stretch border border-hud-cyan/15 bg-hud-cyan/[0.03] rounded-sm overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 bg-hud-red/10 border-r border-hud-red/30 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-hud-red animate-hud-blink" style={{ boxShadow: "0 0 6px #ff3366" }} />
        <span className="font-mono text-[9px] tracking-[0.25em] text-hud-red">LIVE</span>
      </div>
      <div className="relative flex-1 overflow-hidden py-1.5">
        <div ref={trackRef} className="flex w-max">
          {[...HEADLINES, ...HEADLINES].map((h, i) => (
            <Item key={i} text={h} />
          ))}
        </div>
      </div>
    </div>
  )
}
