import { useEffect, useState } from "react"
import { usePrefsStore } from "@/stores/prefsStore"

function systemReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  )
}

/**
 * Effective reduced-motion flag. The user override in prefsStore wins; when set
 * to "system" we follow the OS-level prefers-reduced-motion media query and
 * stay subscribed to changes. Taste Skill mandate: every non-essential
 * animation must be able to stand down.
 */
export function useReducedMotion(): boolean {
  const pref = usePrefsStore((s) => s.motionPref)
  const [sys, setSys] = useState(systemReduced)

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = () => setSys(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  if (pref === "reduced") return true
  if (pref === "full") return false
  return sys
}
