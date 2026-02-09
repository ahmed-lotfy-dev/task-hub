"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onGetStarted: () => void;
  isPending?: boolean;
}

export function CTASection({ onGetStarted, isPending }: CTASectionProps) {
  return (
    <section className="w-full px-6">
      <Card className="relative overflow-hidden p-12 md:p-16 border border-border bg-gradient-to-br from-primary/10 via-background to-accent/30">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-semibold">
            Ready to start
          </p>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Bring calm to your workflow and clarity to your team.
          </h2>
          <p className="text-lg text-muted-foreground">
            Try Task Hub for free and build a workspace your team actually enjoys using.
          </p>
        </div>

        <div className="relative z-10 mt-8">
          <Button
            size="lg"
            className="text-base px-7 rounded-xl"
            onClick={onGetStarted}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Get started free"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
