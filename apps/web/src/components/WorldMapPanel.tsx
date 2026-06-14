import { useEffect, useRef } from "react"
import anime from "animejs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WorldMapPanel({ onClose }: { onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    anime({
      targets: panelRef.current,
      opacity: [0, 1],
      scale: [0.97, 1],
      duration: 380,
      easing: "easeOutCubic",
    })
  }, [])

  return (
    <div ref={panelRef} className="absolute inset-4 z-50" style={{ opacity: 0 }}>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>WORLD MONITOR — LIVE</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>✕ CLOSE</Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div
              className="mx-auto rounded-full border border-hud-cyan/20"
              style={{
                width: 80, height: 80,
                background: "radial-gradient(circle, #00d4ff08, transparent)",
                animation: "spin 12s linear infinite",
              }}
            />
            <p className="font-mono text-[10px] text-hud-cyan/30 tracking-widest animate-hud-blink">
              MAP FEED INITIALIZING...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
