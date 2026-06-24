import { useEffect, useRef } from "react"
import anime from "animejs"

interface Props {
  /** Diameter in px. */
  size?: number
  /** Output reading shown beneath the core, e.g. "98%". */
  output?: string
}

/**
 * The iconic glowing arc-reactor core — counter-rotating coil rings around a
 * breathing plasma core. Pure decoration, but it sells the F.R.I.D.A.Y. fantasy.
 */
export default function ArcReactor({ size = 116, output = "98%" }: Props) {
  const coreRef  = useRef<HTMLDivElement>(null)
  const ring1Ref = useRef<HTMLDivElement>(null)
  const ring2Ref = useRef<HTMLDivElement>(null)
  const glowRef  = useRef<HTMLDivElement>(null)
  const anims    = useRef<anime.AnimeInstance[]>([])

  useEffect(() => {
    const ring1 = anime({
      targets: ring1Ref.current,
      rotate: "360deg",
      duration: 9000,
      easing: "linear",
      loop: true,
    })
    const ring2 = anime({
      targets: ring2Ref.current,
      rotate: "-360deg",
      duration: 6000,
      easing: "linear",
      loop: true,
    })
    const core = anime({
      targets: coreRef.current,
      scale: [1, 1.07, 1],
      duration: 2600,
      easing: "easeInOutSine",
      loop: true,
    })
    const glow = anime({
      targets: glowRef.current,
      opacity: [0.55, 1, 0.55],
      duration: 2600,
      easing: "easeInOutSine",
      loop: true,
    })
    anims.current = [ring1, ring2, core, glow]
    return () => anims.current.forEach((a) => a.pause())
  }, [])

  const cyan = "#00d4ff"

  return (
    <div className="glass-panel rounded-sm p-4 flex flex-col items-center gap-3">
      <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40 self-start">
        ARC REACTOR · PWR CORE
      </p>

      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Outer glow halo */}
        <div
          ref={glowRef}
          className="absolute rounded-full"
          style={{ inset: -8, boxShadow: `0 0 30px ${cyan}66, 0 0 60px ${cyan}33` }}
        />

        {/* Coil ring 1 — dashed, slow CW */}
        <div
          ref={ring1Ref}
          className="absolute rounded-full"
          style={{ inset: 0, border: `2px dashed ${cyan}55` }}
        />
        {/* Coil ring 2 — segmented, faster CCW */}
        <div
          ref={ring2Ref}
          className="absolute rounded-full"
          style={{
            inset: 12,
            border: `3px solid transparent`,
            borderTopColor: cyan,
            borderBottomColor: `${cyan}88`,
          }}
        />

        {/* Triangular coil hint */}
        <div
          className="absolute"
          style={{
            inset: 26,
            clipPath: "polygon(50% 4%, 96% 90%, 4% 90%)",
            border: `1px solid ${cyan}44`,
          }}
        />

        {/* Plasma core */}
        <div
          ref={coreRef}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            width: size * 0.42,
            height: size * 0.42,
            background: `radial-gradient(circle at 40% 35%, #eaffff, ${cyan} 55%, #006688 100%)`,
            boxShadow: `0 0 24px ${cyan}, inset 0 0 14px #ffffffaa`,
          }}
        >
          <span className="font-display text-[7px] tracking-[0.25em] text-hud-bg/80">{output}</span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full font-mono text-[8px] tracking-widest">
        <span className="text-hud-cyan/40">OUTPUT</span>
        <span className="text-hud-green glow-green">{output} · STABLE</span>
      </div>
    </div>
  )
}
