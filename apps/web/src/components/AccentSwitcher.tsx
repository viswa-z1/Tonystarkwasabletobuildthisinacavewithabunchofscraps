import { ACCENTS, useThemeStore, type Accent } from "@/stores/themeStore"

const ORDER: Accent[] = ["cyan", "amber", "green", "red"]

/**
 * Compact row of accent swatches. Selection is persisted to localStorage and
 * exposed to the whole HUD via the --accent CSS variable.
 */
export default function AccentSwitcher() {
  const accent = useThemeStore((s) => s.accent)
  const setAccent = useThemeStore((s) => s.setAccent)

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[8px] tracking-widest text-hud-cyan/30 mr-1">HUE</span>
      {ORDER.map((a) => {
        const selected = a === accent
        return (
          <button
            key={a}
            aria-label={`Accent ${a}`}
            onClick={() => setAccent(a)}
            className="w-3.5 h-3.5 rounded-full transition-transform hover:scale-110"
            style={{
              background: ACCENTS[a],
              boxShadow: selected ? `0 0 8px ${ACCENTS[a]}` : "none",
              outline: selected ? `1px solid ${ACCENTS[a]}` : "1px solid transparent",
              outlineOffset: 2,
              opacity: selected ? 1 : 0.5,
            }}
          />
        )
      })}
    </div>
  )
}
