import * as React from "react"
import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <div className="relative inline-flex items-center cursor-pointer">
        <input
            type="checkbox"
            className="peer sr-only"
            ref={ref}
            {...props}
        />
        <div className={cn(
            "h-6 w-11 rounded-full bg-gray-200 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-950 peer-focus:ring-offset-2",
            className
        )}></div>
    </div>
))
Switch.displayName = "Switch"

export { Switch }
