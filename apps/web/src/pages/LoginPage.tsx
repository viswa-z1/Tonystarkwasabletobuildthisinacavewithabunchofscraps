import { useEffect, useRef, useState } from "react"
import anime from "animejs"
import { Button } from "@/components/ui/button"

const LOGO = "F.R.I.D.A.Y.".split("")
const SUBTITLE = "FULLY RESPONSIVE INTELLIGENT DIGITAL ASSISTANT FOR YOU"

export default function LoginPage() {
  const [chars, setChars]       = useState(0)
  const [showSub, setShowSub]   = useState(false)
  const [showForm, setShowForm] = useState(false)
  const ring1Ref  = useRef<HTMLDivElement>(null)
  const ring2Ref  = useRef<HTMLDivElement>(null)
  const formRef   = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    // Rings animate in and then spin
    if (ring1Ref.current) {
      anime({ targets: ring1Ref.current, scale: [0, 1], opacity: [0, 1], rotate: ["-30deg", "0deg"], duration: 1100, easing: "easeOutCubic" })
      setTimeout(() => {
        anime({ targets: ring1Ref.current, rotate: "360deg", duration: 14000, easing: "linear", loop: true })
      }, 1100)
    }
    if (ring2Ref.current) {
      anime({ targets: ring2Ref.current, scale: [0, 1], opacity: [0, 0.5], rotate: ["30deg", "0deg"], duration: 1100, delay: 150, easing: "easeOutCubic" })
      setTimeout(() => {
        anime({ targets: ring2Ref.current, rotate: "-360deg", duration: 20000, easing: "linear", loop: true })
      }, 1250)
    }

    // Type the logo
    let i = 0
    const t = setInterval(() => {
      i++
      setChars(i)
      if (i >= LOGO.length) {
        clearInterval(t)
        setTimeout(() => setShowSub(true), 200)
        setTimeout(() => setShowForm(true), 750)
      }
    }, 85)
    return () => clearInterval(t)
  }, [])

  // Subtitle typewriter
  useEffect(() => {
    if (!showSub || !subtitleRef.current) return
    anime({
      targets: subtitleRef.current,
      opacity: [0, 1],
      duration: 600,
      easing: "easeOutCubic",
    })
  }, [showSub])

  // Form fade-in
  useEffect(() => {
    if (!showForm || !formRef.current) return
    anime({
      targets: formRef.current,
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 580,
      easing: "easeOutCubic",
    })
  }, [showForm])

  return (
    <div
      className="fixed inset-0 hud-grid flex flex-col items-center justify-center"
      style={{ background: "#000a14" }}
    >
      {/* Decorative rings */}
      <div
        ref={ring1Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 300, height: 300,
          border: "1px solid rgba(0,212,255,0.14)",
          boxShadow: "0 0 30px rgba(0,212,255,0.06)",
          opacity: 0,
        }}
      />
      <div
        ref={ring2Ref}
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 230, height: 230,
          border: "1px dashed rgba(0,212,255,0.08)",
          opacity: 0,
        }}
      />

      {/* Logo + form */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Animated logo */}
        <div className="flex" aria-label="F.R.I.D.A.Y.">
          {LOGO.map((ch, i) => (
            <span
              key={i}
              className="font-display font-black"
              style={{
                fontSize: 52,
                letterSpacing: "0.12em",
                color: "#00d4ff",
                textShadow: "0 0 18px #00d4ff, 0 0 44px #00d4ff44",
                opacity: i < chars ? 1 : 0,
                transform: i < chars ? "translateY(0)" : "translateY(-8px)",
                transition: "opacity 0.12s, transform 0.2s",
              }}
            >
              {ch}
            </span>
          ))}
        </div>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-mono text-[9px] tracking-[0.35em] text-hud-cyan/40 text-center"
          style={{ opacity: 0 }}
        >
          {SUBTITLE}
        </p>

        {/* Auth form */}
        {showForm && (
          <div ref={formRef} className="mt-6 flex flex-col items-center gap-3" style={{ opacity: 0 }}>
            <div className="glass-panel rounded-sm p-6 w-72 flex flex-col gap-3">
              <p className="font-mono text-[9px] tracking-[0.3em] text-hud-cyan/40 text-center mb-1">
                AUTHENTICATION REQUIRED
              </p>
              <Button className="w-full">SIGN IN WITH GOOGLE</Button>
              <Button variant="ghost" className="w-full text-[10px]">
                EMAIL & PASSWORD
              </Button>
            </div>
            <p className="font-mono text-[8px] text-hud-cyan/20 tracking-widest">
              SECURE · AES-256 · PRIVATE
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
