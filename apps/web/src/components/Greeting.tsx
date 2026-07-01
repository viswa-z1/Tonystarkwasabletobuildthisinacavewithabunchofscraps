import { useEffect, useState } from "react"

function greetingFor(hour: number) {
  if (hour < 12) return "GOOD MORNING"
  if (hour < 18) return "GOOD AFTERNOON"
  return "GOOD EVENING"
}

/**
 * Adaptive greeting line for the top bar. Updates through the day and pairs the
 * greeting with the full date. Copy stays plain, no filler verbs or em-dashes.
 */
export default function Greeting() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000)
    return () => clearInterval(t)
  }, [])

  const date = now
    .toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    .toUpperCase()

  return (
    <p className="font-mono text-[8px] tracking-[0.25em] text-hud-cyan/45 mt-1">
      {greetingFor(now.getHours())} <span className="text-hud-cyan/20">·</span> {date}
    </p>
  )
}
