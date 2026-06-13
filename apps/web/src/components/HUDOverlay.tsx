import { ReactNode } from "react"
// HUDOverlay — full-viewport Iron Man HUD container
export default function HUDOverlay({ children }: { children: ReactNode }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "var(--glass-bg)",
      display: "grid",
      placeItems: "center",
    }}>
      {children}
    </div>
  )
}

