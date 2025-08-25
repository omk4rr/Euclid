import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-bright rounded-lg shadow-card hover:shadow-luxury hover:-translate-y-0.5",
        luxury: "bg-gradient-primary text-primary-foreground hover:shadow-luxury hover:-translate-y-1 rounded-lg btn-luxury font-semibold",
        premium: "bg-card border border-card-border text-card-foreground hover:bg-card-hover hover:border-primary/30 rounded-lg shadow-card hover:shadow-glow-primary",
        ghost: "text-foreground-muted hover:bg-secondary hover:text-foreground rounded-lg",
        destructive: "bg-destructive text-primary-foreground hover:bg-destructive/90 rounded-lg shadow-card",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary hover:border-primary/30 rounded-lg",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover rounded-lg shadow-card",
        accent: "bg-accent text-accent-foreground hover:bg-accent-bright hover:shadow-glow-accent rounded-lg shadow-card",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-bright",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base font-semibold",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
