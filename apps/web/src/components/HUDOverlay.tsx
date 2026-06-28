import { useEffect, useRef, ReactNode } from "react"
import anime from "animejs"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import AmbientField from "@/components/AmbientField"

type Corner = "tl" | "tr" | "bl" | "br"

function HUDCorner({ pos }: { pos: Corner }) {
  const hRef = useRef<HTMLDivElement>(null)
  const vRef = useRef<HTMLDivElement>(null)

  const isR = pos.includes("r")
  const isB = pos.includes("b")

  useEffect(() => {
    const delay = { tl: 0, tr: 100, bl: 200, br: 300 }[pos]
    anime({ targets: hRef.current, width: ["0px", "40px"], opacity: [0, 1], duration: 700, delay, easing: "easeOutQuart" })
    anime({ targets: vRef.current, height: ["0px", "40px"], opacity: [0, 1], duration: 700, delay: delay + 100, easing: "easeOutQuart" })
  }, [pos])

  const edge = { [isR ? "right" : "left"]: 20, [isB ? "bottom" : "top"]: 20 }

  return (
    <div className="absolute" style={edge}>
      <div
        ref={hRef}
        className="absolute bg-hud-cyan"
        style={{
          height: 2,
          [isR ? "right" : "left"]: 0,
          [isB ? "bottom" : "top"]: 0,
          opacity: 0,
          width: 0,
        }}
      />
      <div
        ref={vRef}
        className="absolute bg-hud-cyan"
        style={{
          width: 2,
          [isR ? "right" : "left"]: 0,
          [isB ? "bottom" : "top"]: 0,
          opacity: 0,
          height: 0,
        }}
      />
    </div>
  )
}

export default function HUDOverlay({ children }: { children: ReactNode }) {
  const scanRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Repeating scan line sweep — purely ambient, so it stands down when the
  // user (or the OS) asks for reduced motion.
  useEffect(() => {
    if (reduce || !scanRef.current) return
    const anim = anime({
      targets: scanRef.current,
      translateY: ["-2px", "100vh"],
      duration: 7000,
      easing: "linear",
      loop: true,
    })
    return () => anim.pause()
  }, [reduce])

  return (
    <div className="fixed inset-0 hud-grid overflow-hidden" style={{ background: "var(--glass-bg)" }}>
      {/* Ambient depth field */}
      <AmbientField />

      {/* Scan line */}
      {!reduce && (
        <div
          ref={scanRef}
          className="absolute left-0 right-0 pointer-events-none z-0"
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent 0%, #00d4ff33 30%, #00d4ff66 50%, #00d4ff33 70%, transparent 100%)",
          }}
        />
      )}

      {/* HUD corner brackets */}
      <HUDCorner pos="tl" />
      <HUDCorner pos="tr" />
      <HUDCorner pos="bl" />
      <HUDCorner pos="br" />

      {/* Content */}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}
