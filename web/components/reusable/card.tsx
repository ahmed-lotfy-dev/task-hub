"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isPressed?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, isPressed = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white rounded-[32px] p-8 transition-all duration-300",
          "shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff]",
          isPressed && "shadow-[inset_6px_6px_12px_rgba(0,0,0,0.05),inset_-6px_-6px_12px_rgba(255,255,255,1)]",
          "border border-white/50 backdrop-blur-sm",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
