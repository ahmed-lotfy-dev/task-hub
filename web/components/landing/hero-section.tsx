"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/reusable/button";
import { Card } from "@/components/reusable/card";
import React from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
  isPending?: boolean;
}

export function HeroSection({ onGetStarted, isPending }: HeroSectionProps) {
  return (
    <section className="grid lg:grid-cols-2 gap-16 items-center w-full">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col gap-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-white/50 w-fit">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-semibold text-muted-foreground tracking-tight">
            A new era of productivity
          </span>
        </div>

        <h1 className="text-6xl lg:text-7xl font-bold text-[#2D3748] leading-[1.1] tracking-tight">
          Manage tasks with a <span className="text-primary">human touch.</span>
        </h1>

        <p className="text-xl text-zinc-600 leading-relaxed max-w-xl font-medium">
          Experience the most tactile task management tool ever built.
          Beautiful, playful, and incredibly fast.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            size="lg"
            className="text-xl cursor-pointer shadow-lg"
            onClick={onGetStarted}
            disabled={isPending}
          >
            Get Started Free
          </Button>
          <Button variant="white" size="lg" className="text-xl cursor-pointer">
            Watch Demo
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative"
      >
        <div className="relative z-10">
          <Card className="-rotate-6 translate-y-8 relative z-20 overflow-hidden cursor-default">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Zap className="text-secondary w-6 h-6" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Design Review</h3>
            <p className="text-zinc-500 mb-6 font-medium">Review the latest claymorphic assets for the task hub.</p>
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-zinc-200 cursor-pointer hover:translate-y-[-4px] transition-transform" />
              ))}
            </div>
          </Card>

          <Card className="rotate-12 translate-x-12 translate-y-[-20%] relative z-10 bg-primary/5 cursor-default">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                <CheckCircle2 className="text-white w-5 h-5" />
              </div>
              <span className="font-bold">Task Completed!</span>
            </div>
          </Card>
        </div>

        <div className="absolute -top-20 -right-10 w-32 h-32 bg-accent rounded-[32%] rotate-45 blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary rounded-full blur-2xl opacity-20" />
      </motion.div>
    </section>
  );
}
