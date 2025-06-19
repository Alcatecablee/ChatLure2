import * as React from "react";

import { cn } from "@/lib/utils";

// Safe fallback tooltip components that don't depend on Radix UI
const TooltipProvider: React.FC<{
  children: React.ReactNode;
  delayDuration?: number;
}> = ({ children }) => {
  return <>{children}</>;
};

const Tooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

const TooltipTrigger: React.FC<{
  children: React.ReactNode;
  asChild?: boolean;
}> = ({ children }) => {
  return <>{children}</>;
};

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    hidden?: boolean;
  }
>(
  (
    { className, side = "top", sideOffset = 4, hidden, children, ...props },
    ref,
  ) => {
    if (hidden) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
          "absolute pointer-events-none opacity-0", // Hide for now since we don't have positioning logic
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
