"use client";

import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "white";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-primary-foreground cursor-pointer",
      secondary: "bg-secondary text-secondary-foreground cursor-pointer",
      accent: "bg-accent text-accent-foreground cursor-pointer",
      white: "bg-white text-foreground cursor-pointer",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative transition-all duration-200 active:translate-y-[2px] active:shadow-none",
          "rounded-[20px] font-semibold tracking-wide",
          "shadow-[0_6px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_0_rgba(0,0,0,0.1)]",
          "hover:translate-y-[2px]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        {/* Subtle light reflection highlight */}
        <div className="absolute inset-0 rounded-[20px] bg-linear-to-b from-white/20 to-transparent pointer-events-none" />
      </button>
    );
  }
);

Button.displayName = "Button";
