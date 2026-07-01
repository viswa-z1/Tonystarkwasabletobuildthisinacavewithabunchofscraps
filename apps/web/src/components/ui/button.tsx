import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-xs font-mono uppercase tracking-widest transition-all active:scale-[0.97] motion-reduce:active:scale-100 motion-reduce:transition-none disabled:pointer-events-none disabled:opacity-40",
  {
    variants: {
      variant: {
        default:     "border border-hud-cyan text-hud-cyan hover:bg-hud-cyan/10 hover:shadow-[0_0_14px_#00d4ff44]",
        ghost:       "text-hud-cyan/60 hover:text-hud-cyan hover:bg-hud-cyan/5",
        destructive: "border border-hud-red text-hud-red hover:bg-hud-red/10",
        amber:       "border border-hud-amber text-hud-amber hover:bg-hud-amber/10",
        green:       "border border-hud-green text-hud-green hover:bg-hud-green/10",
      },
      size: {
        default: "h-9 px-5 py-2",
        sm:      "h-7 px-3 text-[10px]",
        lg:      "h-11 px-8",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
