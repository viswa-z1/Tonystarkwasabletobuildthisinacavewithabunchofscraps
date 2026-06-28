import { usePrefsStore, type Density } from "@/stores/prefsStore"

const OPTIONS: { value: Density; label: string }[] = [
  { value: "comfortable", label: "COMFORT" },
  { value: "compact", label: "COMPACT" },
]

/**
 * Segmented control for the VISUAL_DENSITY dial. Lets the operator trade
 * breathing room for cockpit information density; persisted via prefsStore.
 */
export default function DensityToggle() {
  const density = usePrefsStore((s) => s.density)
  const setDensity = usePrefsStore((s) => s.setDensity)

  return (
    <div className="inline-flex items-center border border-hud-cyan/20 rounded-sm overflow-hidden" role="group" aria-label="Display density">
      {OPTIONS.map((o) => {
        const active = o.value === density
        return (
          <button
            key={o.value}
            onClick={() => setDensity(o.value)}
            aria-pressed={active}
            className={`font-mono text-[8px] tracking-widest px-2 py-1 transition-colors ${
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
