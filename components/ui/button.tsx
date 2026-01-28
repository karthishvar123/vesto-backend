import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive" | "secondary"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
                    // Variants
                    variant === "default" && "bg-gray-900 text-gray-50 hover:bg-gray-900/90 shadow-sm",
                    variant === "destructive" && "bg-red-500 text-gray-50 hover:bg-red-500/90 shadow-sm",
                    variant === "outline" && "border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900",
                    variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-100/80",
                    variant === "ghost" && "hover:bg-gray-100 hover:text-gray-900",
                    // Sizes
                    size === "default" && "h-10 px-4 py-2",
                    size === "sm" && "h-9 rounded-md px-3",
                    size === "lg" && "h-11 rounded-md px-8",
                    size === "icon" && "h-10 w-10",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
