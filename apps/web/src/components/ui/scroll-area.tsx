import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

/**
 * Vertical scroll container with edge fades that appear only when there is more
 * content in that direction, so the fade is a real affordance rather than
 * decoration. The gradients are pointer-transparent.
 */
export default function ScrollArea({
  className = "",
  innerClassName = "",
  children,
}: {
  className?: string
  innerClassName?: string
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState(false)
  const [bottom, setBottom] = useState(false)

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setTop(el.scrollTop > 4)
    setBottom(el.scrollTop + el.clientHeight < el.scrollHeight - 4)
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    for (const child of Array.from(el.children)) ro.observe(child)
    window.addEventListener("resize", update)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", update)
    }
  }, [update])

  return (
    <div className={`relative min-h-0 ${className}`}>
      <div ref={ref} onScroll={update} className={`h-full overflow-y-auto ${innerClassName}`}>
        {children}
      </div>
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-hud-bg to-transparent transition-opacity duration-200"
        style={{ opacity: top ? 1 : 0 }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-hud-bg to-transparent transition-opacity duration-200"
        style={{ opacity: bottom ? 1 : 0 }}
        aria-hidden
      />
    </div>
  )
}
