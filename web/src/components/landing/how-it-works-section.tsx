"use client";

import { Layout, MousePointer2, Rocket } from "lucide-react";
import { StepCard } from "./step-card";

export function HowItWorksSection() {
  return (
    <section className="w-full flex flex-col gap-20">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-4xl font-extrabold text-[#2D3748] tracking-tight">Simple. Fast. Fun.</h2>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">Getting your team organized shouldn't feel like a chore. Task Hub makes it feel like play.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-12">
        <StepCard
          icon={<Layout className="w-8 h-8 text-primary" />}
          step="01"
          title="Create Workspace"
          description="Set up your team's home base in seconds with dedicated project boards."
        />
        <StepCard
          icon={<MousePointer2 className="w-8 h-8 text-secondary" />}
          step="02"
          title="Assign & Tag"
          description="Drag cards with fluid animations, assign members, and tag priority."
        />
        <StepCard
          icon={<Rocket className="w-8 h-8 text-accent" />}
          step="03"
          title="Launch Goals"
          description="Track progress with real-time sync and celebratory task completion effects."
        />
      </div>
    </section>
  );
}
