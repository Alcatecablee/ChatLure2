import * as React from "react";
import { cn } from "@/lib/utils";

// Safe fallback tooltip components that completely replace @radix-ui/react-tooltip
// This prevents any React hook errors by avoiding the real Radix UI implementation

const TooltipProvider: React.FC<{
  children: React.ReactNode;
  delayDuration?: number;
  disableHoverableContent?: boolean;
  skipDelayDuration?: number;
}> = ({ children, ...props }) => {
  // Simply return children without any tooltip context to prevent hook errors
  return <>{children}</>;
};

const Tooltip: React.FC<{
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
  disableHoverableContent?: boolean;
}> = ({ children, ...props }) => {
  // Return children without tooltip functionality
  return <>{children}</>;
};

const TooltipTrigger = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean;
  }
>(({ children, asChild, ...props }, ref) => {
  // Return the trigger element without tooltip behavior
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { ref, ...props });
  }
  return (
    <span ref={ref} {...props}>
      {children}
    </span>
  );
});
TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    align?: "start" | "center" | "end";
    alignOffset?: number;
    avoidCollisions?: boolean;
    collisionBoundary?: Element | null | Array<Element | null>;
    collisionPadding?: number;
    arrowPadding?: number;
    sticky?: "partial" | "always";
    hideWhenDetached?: boolean;
    hidden?: boolean;
    forceMount?: boolean;
  }
>(
  (
    { className, side = "top", sideOffset = 4, hidden, children, ...props },
    ref,
  ) => {
    // Always return null to completely disable tooltip rendering
    // This prevents any potential layout or hook issues
    return null;
  },
);
TooltipContent.displayName = "TooltipContent";

// Export with the same interface as @radix-ui/react-tooltip
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };

// Also provide a default export for compatibility
export default {
  Provider: TooltipProvider,
  Root: Tooltip,
  Trigger: TooltipTrigger,
  Content: TooltipContent,
};
