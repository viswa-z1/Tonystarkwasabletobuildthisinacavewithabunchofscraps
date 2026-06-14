import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest border",
  {
    variants: {
      variant: {
        cyan:  "border-hud-cyan/30  bg-hud-cyan/8  text-hud-cyan",
        green: "border-hud-green/30 bg-hud-green/8 text-hud-green",
        amber: "border-hud-amber/30 bg-hud-amber/8 text-hud-amber",
        red:   "border-hud-red/30   bg-hud-red/8   text-hud-red",
      },
    },
    defaultVariants: { variant: "cyan" },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
