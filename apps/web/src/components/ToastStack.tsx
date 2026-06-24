import { useEffect, useRef } from "react"
import anime from "animejs"
import { useToastStore, type Toast, type ToastKind } from "@/stores/toastStore"

const THEME: Record<ToastKind, { color: string; tag: string }> = {
  info:    { color: "#00d4ff", tag: "INFO" },
  success: { color: "#00ff88", tag: "OK" },
  warn:    { color: "#ffb300", tag: "WARN" },
  error:   { color: "#ff3366", tag: "ALERT" },
}

function ToastRow({ toast }: { toast: Toast }) {
  const ref = useRef<HTMLDivElement>(null)
  const dismiss = useToastStore((s) => s.dismiss)
  const t = THEME[toast.kind]

  useEffect(() => {
    anime({
      targets: ref.current,
      opacity: [0, 1],
      translateX: [40, 0],
      duration: 320,
      easing: "easeOutCubic",
    })
  }, [])

  return (
    <div
      ref={ref}
      onClick={() => dismiss(toast.id)}
      className="glass-panel rounded-sm flex items-center gap-3 px-3 py-2.5 cursor-pointer w-[280px]"
      style={{ borderColor: `${t.color}55`, boxShadow: `0 0 16px ${t.color}22` }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }}
      />
      <span className="font-mono text-[8px] tracking-widest shrink-0" style={{ color: t.color }}>
        {t.tag}
      </span>
      <span className="font-mono text-[10px] tracking-wide text-hud-cyan/75 leading-snug">
        {toast.message}
      </span>
    </div>
  )
}

/** Fixed bottom-right stack of HUD toasts driven by the toast store. */
export default function ToastStack() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <ToastRow toast={t} />
        </div>
      ))}
    </div>
  )
}
