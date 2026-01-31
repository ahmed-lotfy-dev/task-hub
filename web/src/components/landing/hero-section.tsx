"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroSectionProps {
  onGetStarted: () => void;
  isPending?: boolean;
}

export function HeroSection({ onGetStarted, isPending }: HeroSectionProps) {
  return (
    <section className="grid lg:grid-cols-2 gap-16 items-center w-full">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-10"
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative"
      >
        <div className="relative z-10 flex flex-col gap-6">
          <Card className="-rotate-3 hover:rotate-0 transition-transform duration-500 relative z-20 overflow-hidden cursor-default p-8 shadow-xl">
            <div className="absolute top-0 right-0 p-6">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
                <Zap className="text-secondary w-7 h-7" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-3">Design Review</h3>
            <p className="text-zinc-500 mb-8 font-medium max-w-[280px]">Review the latest claymorphic assets for the task hub.</p>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-zinc-100 cursor-pointer hover:translate-y-[-4px] transition-transform shadow-sm" />
              ))}
            </div>
          </Card>

          <Card className="rotate-6 translate-x-12 -mt-12 hover:rotate-3 transition-transform duration-500 relative z-10 bg-primary/5 cursor-default p-8 border-primary/20 shadow-lg max-w-sm ml-auto">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-xl shadow-primary/20">
                <CheckCircle2 className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-lg">Task Completed!</span>
                <span className="text-zinc-500 text-sm font-medium">Platform architecture ready</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="absolute -top-20 -right-10 w-32 h-32 bg-accent rounded-[32%] rotate-45 blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary rounded-full blur-2xl opacity-20" />
      </motion.div>
    </section>
  );
}
