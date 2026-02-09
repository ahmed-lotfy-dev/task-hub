"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="w-full px-6">
      <Card className="bg-gradient-to-br from-cyan-600 to-teal-500 p-20 flex flex-col items-center text-center gap-10 relative overflow-hidden group rounded-[2.5rem] border-none shadow-2xl">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
          <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tight font-sans">
            Ready to clarify your workflow?
          </h2>
          <p className="text-cyan-50/90 text-xl font-medium leading-relaxed">
            Join thousands of modern teams using Task Hub to organize their work with crystal clear focus and joy.
          </p>
        </div>

        <div className="relative z-10 pt-4">
          <Button
            size="lg"
            className="text-xl px-12 py-7 rounded-2xl bg-white text-cyan-700 hover:bg-cyan-50 shadow-xl shadow-cyan-900/10 cursor-pointer hover:scale-105 transition-transform font-bold"
            onClick={onGetStarted}
          >
            Get Started Now — It's Free
          </Button>
        </div>
      </Card>
    </section>
  );
}
