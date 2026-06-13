// VoiceOrb — animated orb showing agent state
// States: idle | listening | thinking | speaking
export type OrbState = "idle" | "listening" | "thinking" | "speaking"

interface Props {
  state: OrbState
  onClick?: () => void
}

export default function VoiceOrb({ state, onClick }: Props) {
  // TODO: implement SVG + Framer Motion animation
  return (
    <div onClick={onClick} style={{ cursor: "pointer", textAlign: "center" }}>
      <div style={{
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: "radial-gradient(circle, #00d4ff33, #000a14)",
        border: "2px solid var(--accent-cyan)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        color: "var(--accent-cyan)",
        fontSize: 12,
      }}>
        {state.toUpperCase()}
      </div>
    </div>
  )
}

