"use client";

import React from "react";
import { motion } from "framer-motion";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#F8FAFC] overflow-hidden">
      {/* Background Floating Shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingShape
          color="bg-accent/20"
          size="w-64 h-64"
          initialX="10%"
          initialY="10%"
          duration={20}
        />
        <FloatingShape
          color="bg-primary/20"
          size="w-96 h-96"
          initialX="70%"
          initialY="60%"
          duration={25}
        />
        <FloatingShape
          color="bg-secondary/20"
          size="w-48 h-48"
          initialX="40%"
          initialY="30%"
          duration={18}
        />
      </div>

      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold text-[#2D3748] tracking-tight">
          Task<span className="text-primary">Hub</span>
        </div>
        <div className="flex gap-4">
          {/* Navigation links could go here */}
        </div>
      </nav>

      <main className="relative z-10">{children}</main>
    </div>
  );
}

function FloatingShape({
  color,
  size,
  initialX,
  initialY,
  duration,
}: {
  color: string;
  size: string;
  initialX: string;
  initialY: string;
  duration: number;
}) {
  return (
    <motion.div
      className={cn("absolute rounded-full blur-3xl", color, size)}
      style={{ left: initialX, top: initialY }}
      animate={{
        x: [0, 50, -30, 0],
        y: [0, -40, 60, 0],
        rotate: [0, 360],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

import { cn } from "@/lib/utils";
