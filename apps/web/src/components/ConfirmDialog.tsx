import { useEffect, useRef } from "react"
import anime from "animejs"
import { useConfirmStore } from "@/stores/confirmStore"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * App-wide confirm modal driven by the confirm() helper. Traps nothing beyond a
 * backdrop, focuses the primary action, and treats Escape and backdrop clicks
 * as cancel so it always resolves the pending promise.
 */
export default function ConfirmDialog() {
  const pending = useConfirmStore((s) => s.pending)
  const respond = useConfirmStore((s) => s.respond)
  const reduce = useReducedMotion()
  const confirmRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!pending) return
    const id = requestAnimationFrame(() => confirmRef.current?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") respond(false)
    }
    window.addEventListener("keydown", onKey)
    if (!reduce)
      anime({ targets: panelRef.current, opacity: [0, 1], scale: [0.96, 1], duration: 200, easing: "easeOutCubic" })
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener("keydown", onKey)
    }
  }, [pending, respond, reduce])

  if (!pending) return null

  const danger = pending.danger
  const accent = danger ? "#ff3366" : "#00d4ff"

  return (
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => respond(false)}
      role="alertdialog"
      aria-modal="true"
      aria-label={pending.title}
    >
      <div
        ref={panelRef}
        className="glass-panel rounded-sm w-[min(92vw,380px)] p-5 flex flex-col gap-4"
        style={{ borderColor: `${accent}45` }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-[11px] tracking-[0.25em]" style={{ color: accent }}>
          {pending.title}
        </h2>
        <p className="font-mono text-[10px] leading-relaxed tracking-wide text-hud-cyan/65">
          {pending.message}
        </p>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => respond(false)}
            className="font-mono text-[10px] tracking-widest text-hud-cyan/55 hover:text-hud-cyan border border-hud-cyan/20 px-3 py-1.5 rounded-sm transition-colors"
          >
            {pending.cancelLabel ?? "CANCEL"}
          </button>
          <button
            ref={confirmRef}
            onClick={() => respond(true)}
            className="font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-sm border transition-colors"
            style={{ color: accent, borderColor: `${accent}66` }}
          >
            {pending.confirmLabel ?? "CONFIRM"}
          </button>
        </div>
      </div>
    </div>
  )
}
