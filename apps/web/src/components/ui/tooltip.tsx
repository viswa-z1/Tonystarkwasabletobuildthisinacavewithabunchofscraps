import { ReactNode, useState } from "react"

type Side = "top" | "bottom" | "left" | "right"

const POS: Record<Side, string> = {
  top:    "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left:   "right-full top-1/2 -translate-y-1/2 mr-1.5",
  right:  "left-full top-1/2 -translate-y-1/2 ml-1.5",
}

/**
 * Lightweight tooltip. Opens on hover and on keyboard focus (React focus events
 * bubble), closes on blur, leave or Escape. Purely a label affordance, so it is
 * pointer-transparent and never traps interaction.
 */
export default function Tooltip({
  label,
  side = "bottom",
  children,
}: {
  label: string
  side?: Side
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false)
      }}
    >
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-[70] whitespace-nowrap glass-panel rounded-sm px-2 py-1 font-mono text-[8px] tracking-widest text-hud-cyan/80 border border-hud-cyan/25 transition-opacity duration-150 ${POS[side]} ${
          open ? "opacity-100" : "opacity-0"
        }`}
      >
        {label}
      </span>
    </span>
  )
}
