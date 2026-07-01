import { useFps } from "@/hooks/useFps"

/** Compact render-rate chip; colour tracks smoothness thresholds. */
export default function FpsMeter() {
  const fps = useFps()
  const color = fps >= 50 ? "#00ff88" : fps >= 30 ? "#ffb300" : "#ff3366"

  return (
    <span
      className="font-mono text-[8px] tracking-widest tabular-nums"
      style={{ color }}
      role="status"
      aria-label={`Render rate ${fps} frames per second`}
    >
      {fps} FPS
    </span>
  )
}
