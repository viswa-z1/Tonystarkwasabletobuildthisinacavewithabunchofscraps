import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/useReducedMotion"

/**
 * Loading placeholder. Shimmers by default and falls back to a still tint when
 * motion is reduced, so the loading affordance never becomes a distraction.
 */
export function Skeleton({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  return <div className={cn("rounded-sm", reduce ? "hud-skeleton-static" : "hud-shimmer", className)} />
}
