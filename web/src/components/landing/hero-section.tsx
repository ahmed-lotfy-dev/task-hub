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
    <section className="grid lg:grid-cols-2 gap-16 items-center w-full px-6">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-8 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50/50 border border-cyan-100 backdrop-blur-sm w-fit shadow-sm">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span className="text-sm font-semibold text-cyan-800 tracking-tight">
            The future of work is here
          </span>
        </div>

        <h1 className="text-6xl lg:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight font-sans">
          Manage tasks with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-500">
            crystal clarity.
          </span>
        </h1>

        <p className="text-xl text-slate-600 leading-relaxed max-w-xl font-medium">
          Experience a workspace that feels as good as it looks.
          Beautiful glassmorphism, fluid interactions, and powerful focus.
        </p>

        <div className="flex flex-wrap gap-4 pt-4">
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            onClick={onGetStarted}
            disabled={isPending}
          >
            Get Started Free
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="text-lg px-8 py-6 rounded-2xl text-slate-600 hover:text-cyan-800 hover:bg-cyan-50 transition-all"
          >
            Watch Demo
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative perspective-1000"
      >
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-400/20 to-teal-300/20 rounded-full blur-3xl -z-10 animate-pulse" />

        {/* Glass Cards Container */}
        <div className="relative z-10 flex flex-col gap-6 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-700 ease-out preserve-3d">

          {/* Main Card */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] relative z-20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Zap className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Q3 Marketing Launch</h3>
                <p className="text-slate-500 text-sm font-medium">In Progress • 85% Complete</p>
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-white/40 shadow-sm hover:scale-[1.02] transition-transform cursor-pointer">
                  <div className={`w-2 h-2 rounded-full ${i === 1 ? 'bg-emerald-400' : i === 2 ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                  <div className="h-2 w-24 bg-slate-200 rounded-full" />
                  <div className="ml-auto h-6 w-6 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-white/60 backdrop-blur-md border border-white/60 p-4 rounded-2xl shadow-xl animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">Task Completed</span>
                <span className="text-xs text-slate-500">Just now</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
