import { useCallback, useEffect, useRef, useState } from "react"
import anime from "animejs"
import HUDOverlay from "@/components/HUDOverlay"
import ArcReactor from "@/components/ArcReactor"
import ClockPanel from "@/components/ClockPanel"
import VitalsPanel from "@/components/VitalsPanel"
import RadarSweep from "@/components/RadarSweep"
import WeatherPanel from "@/components/WeatherPanel"
import ReminderPanel from "@/components/ReminderPanel"
import NewsTicker from "@/components/NewsTicker"
import StockTicker from "@/components/StockTicker"
import VoiceOrb, { OrbState } from "@/components/VoiceOrb"
import AccentSwitcher from "@/components/AccentSwitcher"
import DensityToggle from "@/components/DensityToggle"
import { toast } from "@/stores/toastStore"
import { useUIStore } from "@/stores/uiStore"
import { usePrefsStore } from "@/stores/prefsStore"
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

const ORB_CYCLE: OrbState[] = ["idle", "listening", "thinking", "speaking"]

function isTyping(el: EventTarget | null) {
  const node = el as HTMLElement | null
  if (!node) return false
  return node.tagName === "INPUT" || node.tagName === "TEXTAREA" || node.isContentEditable
}

export default function DashboardPage() {
  const [booted, setBooted]   = useState(false)
  const orbState              = useUIStore((s) => s.orbState)
  const setOrbState           = useUIStore((s) => s.setOrbState)
  const [messages, setMessages] = useState<Message[]>([])
  const contentRef            = useRef<HTMLDivElement>(null)
  const density               = usePrefsStore((s) => s.density)
  const gap                   = density === "compact" ? "gap-2" : "gap-4"
  const pad                   = density === "compact" ? "p-3" : "p-5"

  // Tap the orb (or press Space) to walk the voice pipeline state machine and
  // drive a short scripted exchange into the transcript.
  const advanceOrb = useCallback(() => {
    const next = ORB_CYCLE[(ORB_CYCLE.indexOf(orbState) + 1) % ORB_CYCLE.length]
    setOrbState(next)
    if (next === "listening")
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "user", text: "Friday, give me a status report." }])
    else if (next === "speaking")
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", text: "All systems nominal — reactor at 98%, no contacts inbound." }])
  }, [orbState, setOrbState])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isTyping(e.target)) {
        e.preventDefault()
        advanceOrb()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [advanceOrb])

  useEffect(() => {
    const t = setTimeout(() => {
      setBooted(true)
      toast.success("F.R.I.D.A.Y. online — all systems nominal")
    }, BOOT_LINES.length * 480 + 800)
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
      <div ref={contentRef} className={`h-full flex flex-col ${pad} ${gap}`}>

        {/* Top bar */}
        <div className="panel opacity-0 flex items-center justify-between">
          <div>
            <h1
              className="font-display text-[11px] tracking-[0.35em]"
              style={{ color: "var(--accent)", textShadow: "0 0 8px var(--accent), 0 0 24px color-mix(in srgb, var(--accent) 30%, transparent)" }}
            >
              F.R.I.D.A.Y.
            </h1>
            <p className="font-mono text-[8px] text-hud-cyan/35 tracking-[0.2em] mt-0.5">
              FULLY RESPONSIVE INTELLIGENT DIGITAL ASSISTANT FOR YOU
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DensityToggle />
            <AccentSwitcher />
            <StatusBar />
          </div>
        </div>

        {/* Main grid */}
        <div className={`panel opacity-0 flex-1 grid grid-cols-3 ${gap} min-h-0`}>

          {/* Left — system widgets rail */}
          <div className={`col-span-1 flex flex-col ${gap} min-h-0 overflow-y-auto pr-1`}>
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
            <VoiceOrb state={orbState} onClick={advanceOrb} />
            <WaveformVisualizer state={orbState} />
            <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/25 animate-hud-blink">
              {orbState === "idle" ? "TAP ORB OR PRESS SPACE TO ACTIVATE" : `STATE · ${orbState.toUpperCase()}`}
            </p>
          </div>

          {/* Right — transcript + weather + reminders rail */}
          <div className={`col-span-1 flex flex-col ${gap} min-h-0 overflow-y-auto pr-1`}>
            <div className="flex-1 min-h-[140px]">
              <TranscriptPanel messages={messages} />
            </div>
            <WeatherPanel />
            <ReminderPanel />
          </div>
        </div>

        {/* News + market tickers */}
        <div className="panel opacity-0 flex flex-col gap-2">
          <NewsTicker />
          <StockTicker />
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
