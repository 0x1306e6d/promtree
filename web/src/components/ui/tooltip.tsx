import * as React from "react"

import { cn } from "@/lib/utils"

function TooltipProvider({ children }: { delayDuration?: number; children: React.ReactNode }) {
  return <>{children}</>
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="group/tooltip relative inline-flex">{children}</div>
}

function TooltipTrigger({
  asChild,
  children,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      ...props,
      "data-slot": "tooltip-trigger",
      className: cn(
        (children.props as { className?: string }).className,
        "peer"
      ),
    })
  }
  return (
    <button data-slot="tooltip-trigger" className="peer" {...props}>
      {children}
    </button>
  )
}

function TooltipContent({
  className,
  sideOffset: _sideOffset = 0,
  side = "top",
  children,
  ...props
}: React.ComponentProps<"div"> & { sideOffset?: number; side?: "top" | "bottom" | "left" | "right" }) {
  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  }

  return (
    <div
      data-slot="tooltip-content"
      className={cn(
        "pointer-events-none absolute z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background opacity-0 transition-opacity group-hover/tooltip:opacity-100",
        positionClasses[side],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
