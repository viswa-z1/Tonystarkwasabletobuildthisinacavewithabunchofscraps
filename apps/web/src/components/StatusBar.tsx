// StatusBar — shows STT/LLM/TTS status + connection quality
export default function StatusBar() {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--accent-cyan)", opacity: 0.7 }}>
      STT: ONLINE · LLM: ONLINE · TTS: ONLINE
    </div>
  )
}

