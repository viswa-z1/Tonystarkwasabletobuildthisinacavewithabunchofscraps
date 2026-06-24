import { useEffect, useRef, useState } from "react"
import anime from "animejs"
import HUDOverlay from "@/components/HUDOverlay"
import ArcReactor from "@/components/ArcReactor"
import ClockPanel from "@/components/ClockPanel"
import VitalsPanel from "@/components/VitalsPanel"
import RadarSweep from "@/components/RadarSweep"
import WeatherPanel from "@/components/WeatherPanel"
import VoiceOrb, { OrbState } from "@/components/VoiceOrb"
import WaveformVisualizer from "@/components/WaveformVisualizer"
import StatusBar from "@/components/StatusBar"
import TranscriptPanel, { Message } from "@/components/TranscriptPanel"

const BOOT_LINES = [
  "INITIALIZING CORE SYSTEMS...",
  "NEURAL INTERFACE: ONLINE",
  "MCP SERVER: CONNECTED",
  "VOICE PIPELINE: READY",
  "F.R.I.D.A.Y. ONLINE",
]

const SYSINFO = [
  { label: "VOICE CORE",  value: "NOMINAL", color: "#00ff88" },
  { label: "LLM BRIDGE",  value: "ACTIVE",  color: "#00ff88" },
  { label: "MCP TOOLS",   value: "LOADED",  color: "#00ff88" },
  { label: "SECURE LINK", value: "AES-256", color: "#00d4ff" },
]

function BootScreen() {
  const [line, setLine] = useState(0)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setInterval(() => setLine((p) => Math.min(p + 1, BOOT_LINES.length - 1)), 480)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    anime({ targets: cursorRef.current, opacity: [1, 0, 1], duration: 700, loop: true, easing: "steps(1)" })
  }, [])

  return (
    <div className="flex flex-col items-center gap-2">
      {BOOT_LINES.map((l, i) => (
        <p
          key={i}
          className="font-mono text-xs tracking-widest transition-opacity duration-300"
          style={{
            color:   i === BOOT_LINES.length - 1 ? "#00ff88" : "#00d4ff",
            opacity: i <= line ? (i < line ? 0.45 : 1) : 0,
          }}
        >
          {l}
        </p>
      ))}
      <div ref={cursorRef} className="mt-3 w-1.5 h-4 bg-hud-cyan" />
    </div>
  )
}

export default function DashboardPage() {
  const [booted, setBooted]   = useState(false)
  const [orbState]            = useState<OrbState>("idle")
  const [messages]            = useState<Message[]>([])
  const contentRef            = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), BOOT_LINES.length * 480 + 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!booted || !contentRef.current) return
    anime({
      targets: contentRef.current.querySelectorAll(".panel"),
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 550,
      delay: anime.stagger(110),
      easing: "easeOutCubic",
    })
  }, [booted])

  if (!booted) {
    return (
      <HUDOverlay>
        <BootScreen />
      </HUDOverlay>
    )
  }

  return (
    <HUDOverlay>
      <div ref={contentRef} className="h-full flex flex-col p-5 gap-4">

        {/* Top bar */}
        <div className="panel opacity-0 flex items-center justify-between">
          <div>
            <h1 className="font-display text-[11px] tracking-[0.35em] text-hud-cyan glow-cyan">
              F.R.I.D.A.Y.
            </h1>
            <p className="font-mono text-[8px] text-hud-cyan/35 tracking-[0.2em] mt-0.5">
              FULLY RESPONSIVE INTELLIGENT DIGITAL ASSISTANT FOR YOU
            </p>
          </div>
          <StatusBar />
        </div>

        {/* Main grid */}
        <div className="panel opacity-0 flex-1 grid grid-cols-3 gap-4 min-h-0">

          {/* Left — system widgets rail */}
          <div className="col-span-1 flex flex-col gap-4 min-h-0 overflow-y-auto pr-1">
            <ArcReactor />
            <ClockPanel />

            <div className="glass-panel rounded-sm p-4 flex flex-col gap-3">
              <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">SYSTEM STATUS</p>
              {SYSINFO.map((s) => (
                <div key={s.label} className="flex justify-between items-center border-b border-hud-cyan/8 pb-2">
                  <span className="font-mono text-[10px] text-hud-cyan/50">{s.label}</span>
                  <span className="font-mono text-[10px]" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>

            <VitalsPanel />
            <RadarSweep />
          </div>

          {/* Center — orb + waveform */}
          <div className="col-span-1 flex flex-col items-center justify-center gap-5">
            <VoiceOrb state={orbState} />
            <WaveformVisualizer state={orbState} />
            <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/25 animate-hud-blink">
              TAP ORB TO ACTIVATE
            </p>
          </div>

          {/* Right — transcript + weather rail */}
          <div className="col-span-1 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <TranscriptPanel messages={messages} />
            </div>
            <WeatherPanel />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="panel opacity-0 flex items-center justify-between">
          <span className="font-mono text-[8px] text-hud-cyan/25 tracking-widest">
            SECURE CHANNEL · AES-256-GCM
          </span>
          <span className="font-mono text-[8px] text-hud-cyan/25 tracking-widest animate-hud-flicker">
            LIVEKIT BRIDGE · MCP ACTIVE
          </span>
        </div>

      </div>
    </HUDOverlay>
  )
}
