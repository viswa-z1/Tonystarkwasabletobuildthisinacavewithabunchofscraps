import { useEffect, useState } from "react"
import { toast } from "@/stores/toastStore"

/**
 * Real online/offline indicator backed by navigator.onLine and the
 * online/offline events. The status dot is genuine semantic state (the one
 * place Taste Skill allows a coloured dot), and transitions raise a toast.
 */
export default function ConnectionStatus() {
  const [online, setOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine
  )

  useEffect(() => {
    const goOnline = () => {
      setOnline(true)
      toast.success("Uplink restored")
    }
    const goOffline = () => {
      setOnline(false)
      toast.warn("Uplink lost, running on cache")
    }
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  const color = online ? "#00ff88" : "#ff3366"

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-widest"
      style={{ color }}
      role="status"
      aria-label={online ? "Uplink online" : "Uplink offline"}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color, boxShadow: `0 0 5px ${color}` }}
      />
      {online ? "UPLINK" : "OFFLINE"}
    </span>
  )
}
