import { useEffect, useRef } from "react"
import anime from "animejs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface Message {
  id: string
  role: "user" | "assistant"
  text: string
}

function MessageRow({ msg }: { msg: Message }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    anime({
      targets: ref.current,
      opacity: [0, 1],
      translateX: [msg.role === "assistant" ? -14 : 14, 0],
      duration: 380,
      easing: "easeOutCubic",
    })
  }, [msg.role])

  const isBot = msg.role === "assistant"
  return (
    <div ref={ref} className={`flex gap-2 ${isBot ? "" : "flex-row-reverse"}`} style={{ opacity: 0 }}>
      <span
        className="shrink-0 text-[8px] font-mono tracking-widest pt-0.5 opacity-60"
        style={{ color: isBot ? "#00ff88" : "#00d4ff" }}
      >
        {isBot ? "FRIDAY" : "YOU"}
      </span>
      <p
        className="text-[11px] font-mono leading-relaxed"
        style={{ color: isBot ? "#00ff88bb" : "#00d4ffbb" }}
      >
        {msg.text}
      </p>
    </div>
  )
}

export default function TranscriptPanel({ messages = [] }: { messages?: Message[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>TRANSCRIPT</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-3">
        <div ref={scrollRef} className="h-full overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 ? (
            <p className="text-[10px] font-mono tracking-widest text-hud-cyan/25 animate-hud-blink">
              AWAITING INPUT...
            </p>
          ) : (
            messages.map((m) => <MessageRow key={m.id} msg={m} />)
          )}
        </div>
      </CardContent>
    </Card>
  )
}
