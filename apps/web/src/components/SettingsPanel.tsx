import { useEffect, useRef } from "react"
import anime from "animejs"
import { useUIStore } from "@/stores/uiStore"
import { usePrefsStore, type MotionPref } from "@/stores/prefsStore"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import AccentSwitcher from "@/components/AccentSwitcher"
import DensityToggle from "@/components/DensityToggle"

const MOTION_OPTIONS: { value: MotionPref; label: string }[] = [
  { value: "system", label: "SYSTEM" },
  { value: "full", label: "FULL" },
  { value: "reduced", label: "REDUCED" },
]

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] tracking-widest text-hud-cyan/70">{label}</span>
        <span className="font-mono text-[8px] tracking-widest text-hud-cyan/30">{hint}</span>
      </div>
      {children}
    </div>
  )
}

function MotionControl() {
  const pref = usePrefsStore((s) => s.motionPref)
  const setPref = usePrefsStore((s) => s.setMotionPref)
  return (
    <div className="inline-flex items-center border border-hud-cyan/20 rounded-sm overflow-hidden self-start" role="group" aria-label="Motion preference">
      {MOTION_OPTIONS.map((o) => {
        const active = o.value === pref
        return (
          <button
            key={o.value}
            onClick={() => setPref(o.value)}
            aria-pressed={active}
            className={`font-mono text-[8px] tracking-widest px-2.5 py-1 transition-colors ${
              active ? "bg-hud-cyan/15 text-hud-cyan" : "text-hud-cyan/40 hover:text-hud-cyan/70"
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Settings surface. Aggregates the Taste Skill dials a user can drive: motion
 * preference, display density and accent. Labels sit above controls, every
 * control is keyboard reachable, and copy carries no em-dashes.
 */
export default function SettingsPanel() {
  const open = useUIStore((s) => s.settingsOpen)
  const setOpen = useUIStore((s) => s.setSettingsOpen)
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setOpen])

  useEffect(() => {
    if (open && !reduce)
      anime({ targets: panelRef.current, opacity: [0, 1], translateX: [24, 0], duration: 260, easing: "easeOutCubic" })
  }, [open, reduce])

  if (!open) return null

  const motionLabel = reduce ? "MOTION CALM" : "MOTION ACTIVE"

  return (
    <div className="fixed inset-0 z-[58] flex justify-end bg-black/55 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        ref={panelRef}
        className="glass-panel h-full w-[min(92vw,360px)] border-l border-hud-cyan/25 p-6 flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-[11px] tracking-[0.3em] text-hud-cyan glow-cyan">SETTINGS</h2>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close settings"
            className="font-mono text-[10px] tracking-widest text-hud-cyan/50 hover:text-hud-cyan border border-hud-cyan/20 px-2 py-0.5 rounded-sm"
          >
            ESC
          </button>
        </div>

        <Field label="MOTION" hint={motionLabel}>
          <MotionControl />
          <p className="font-mono text-[8px] leading-relaxed tracking-wide text-hud-cyan/35">
            System follows your OS reduced-motion setting. Reduced stands down all ambient HUD animation.
          </p>
        </Field>

        <Field label="DENSITY" hint="LAYOUT RHYTHM">
          <DensityToggle />
        </Field>

        <Field label="ACCENT" hint="ONE HUE, LOCKED">
          <AccentSwitcher />
        </Field>

        <div className="mt-auto border-t border-hud-cyan/10 pt-4">
          <p className="font-mono text-[8px] tracking-widest text-hud-cyan/30">
            F.R.I.D.A.Y. HUD · PREFERENCES SAVED LOCALLY
          </p>
        </div>
      </div>
    </div>
  )
}
