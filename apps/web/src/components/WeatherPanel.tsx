import { useEffect, useRef } from "react"
import anime from "animejs"

interface Forecast {
  day: string
  glyph: string
  hi: number
  lo: number
}

const CONDITION = {
  city: "MUMBAI",
  glyph: "⛅",
  temp: 31,
  desc: "PARTLY CLOUDY",
  feels: 34,
  humidity: 68,
  wind: 12,
}

const FORECAST: Forecast[] = [
  { day: "TUE", glyph: "☀", hi: 33, lo: 27 },
  { day: "WED", glyph: "⛅", hi: 31, lo: 26 },
  { day: "THU", glyph: "🌧", hi: 29, lo: 25 },
  { day: "FRI", glyph: "⛈", hi: 28, lo: 24 },
]

/**
 * Themed weather readout — current conditions plus a 4-day forecast strip.
 * Static demo data; wires to the get_weather MCP tool later.
 */
export default function WeatherPanel() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    anime({
      targets: ref.current?.querySelectorAll(".fc-day"),
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 400,
      delay: anime.stagger(70),
      easing: "easeOutCubic",
    })
  }, [])

  return (
    <div ref={ref} className="glass-panel rounded-sm p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[8px] tracking-[0.3em] text-hud-cyan/40">WEATHER</p>
        <p className="font-mono text-[8px] tracking-widest text-hud-cyan/50">{CONDITION.city}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{CONDITION.glyph}</span>
        <div className="flex flex-col">
          <span className="font-display text-2xl text-hud-cyan glow-cyan tabular-nums leading-none">
            {CONDITION.temp}°
          </span>
          <span className="font-mono text-[8px] tracking-widest text-hud-cyan/45 mt-1">
            {CONDITION.desc}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-[8px] tracking-widest text-hud-cyan/45">
        <span>FEELS {CONDITION.feels}°</span>
        <span>HUM {CONDITION.humidity}%</span>
        <span>WIND {CONDITION.wind}km/h</span>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-hud-cyan/8 pt-3">
        {FORECAST.map((f) => (
          <div key={f.day} className="fc-day opacity-0 flex flex-col items-center gap-1">
            <span className="font-mono text-[8px] tracking-widest text-hud-cyan/40">{f.day}</span>
            <span className="text-base leading-none">{f.glyph}</span>
            <span className="font-mono text-[8px] tabular-nums">
              <span className="text-hud-cyan/70">{f.hi}°</span>
              <span className="text-hud-cyan/30"> {f.lo}°</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
