import { useEffect, useRef, useState } from "react"

/**
 * Live frames-per-second, sampled once per second from a requestAnimationFrame
 * loop. Real measurement, not a fake-perfect number.
 */
export function useFps(): number {
  const [fps, setFps] = useState(60)
  const frames = useRef(0)
  const last = useRef(performance.now())
  const raf = useRef(0)

  useEffect(() => {
    const loop = () => {
      frames.current += 1
      const now = performance.now()
      const elapsed = now - last.current
      if (elapsed >= 1000) {
        setFps(Math.round((frames.current * 1000) / elapsed))
        frames.current = 0
        last.current = now
      }
      raf.current = requestAnimationFrame(loop)
    }
    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return fps
}
