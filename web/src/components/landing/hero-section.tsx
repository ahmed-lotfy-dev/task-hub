"use client";

import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HeroSectionProps {
  onGetStarted: () => void;
  isPending?: boolean;
}

export function HeroSection({ onGetStarted, isPending }: HeroSectionProps) {
  return (
    <section className="grid lg:grid-cols-2 gap-16 items-center w-full px-6">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-8 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground border border-border w-fit">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold tracking-tight">
            Focused work for modern teams
          </span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground">
          A calm, modern home for your work.
          <span className="block text-primary">Plan. Ship. Repeat.</span>
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
          Task Hub combines the clarity of boards with the structure of
          planning. Minimal by design, powerful by default.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <Button
            size="lg"
            className="text-base px-7 rounded-xl"
            onClick={onGetStarted}
            disabled={isPending}
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="lg" className="text-base px-7 rounded-xl">
            Watch demo
          </Button>
        </div>

        <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Live collaboration</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span>AI assisted planning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Secure by default</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />

        <Card className="p-6 lg:p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                Project overview
              </p>
              <h3 className="text-2xl font-bold text-foreground mt-2">Q3 Launch</h3>
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              86
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {["Design review", "Build release notes", "Stakeholder sync"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-foreground">{item}</span>
                <span className="ml-auto text-xs text-muted-foreground">Today</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>5 tasks completed this week</span>
          </div>
        </Card>
      </motion.div>
    </section>
  );
}
