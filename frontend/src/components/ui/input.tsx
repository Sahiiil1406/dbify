import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-gray-900/50 border-white/10 h-11 w-full min-w-0 rounded-xl border backdrop-blur-md px-4 py-3 text-base text-white shadow-lg transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 focus:bg-gray-800/80",
        "hover:border-white/20 hover:bg-gray-800/60",
        "aria-invalid:ring-red-500/20 aria-invalid:border-red-500",
        className
      )}
      {...props}
    />
  )
}

export { Input }
