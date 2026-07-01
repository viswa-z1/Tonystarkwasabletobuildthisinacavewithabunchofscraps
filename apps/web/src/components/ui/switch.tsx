/**
 * Accessible toggle switch. Exposes role="switch" with aria-checked so it reads
 * correctly to assistive tech; the thumb slides and lights when on.
 */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full border transition-colors shrink-0 ${
        checked ? "bg-hud-cyan/25 border-hud-cyan/50" : "bg-hud-cyan/5 border-hud-cyan/20"
      }`}
    >
      <span
        className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all duration-200"
        style={{
          left: checked ? 18 : 2,
          background: checked ? "#00d4ff" : "rgba(0,212,255,0.4)",
          boxShadow: checked ? "0 0 6px #00d4ff" : "none",
        }}
      />
    </button>
  )
}
