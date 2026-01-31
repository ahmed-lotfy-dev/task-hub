"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onGetStarted: () => void;
}

export function CTASection({ onGetStarted }: CTASectionProps) {
  return (
    <section className="w-full">
      <Card className="bg-primary p-16 flex flex-col items-center text-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col gap-4">
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Ready to boost your productivity?</h2>
          <p className="text-primary-foreground/80 text-lg font-medium max-w-xl mx-auto">
            Join thousands of teams already using Task Hub to organize their life and work with joy.
          </p>
        </div>

        <div className="relative z-10">
          <Button variant="white" size="lg" className="text-xl px-12 py-6 cursor-pointer hover:scale-105 transition-transform" onClick={onGetStarted}>
            Get Started Now — It's Free
          </Button>
        </div>
      </Card>
    </section>
  );
}
