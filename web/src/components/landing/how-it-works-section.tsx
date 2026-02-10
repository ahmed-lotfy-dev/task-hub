"use client";

import { Layout, MousePointer2, Rocket } from "lucide-react";
import { StepCard } from "./step-card";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full flex flex-col gap-16">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
          Simple flows that keep teams aligned
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Clear steps, fewer clicks, and a workspace that stays tidy even when work moves fast.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <StepCard
          icon={<Layout className="w-8 h-8 text-primary" />}
          step="01"
          title="Create Workspace"
          description="Spin up boards and lanes in seconds, then invite your team with one link."
        />
        <StepCard
          icon={<MousePointer2 className="w-8 h-8 text-foreground" />}
          step="02"
          title="Assign & Tag"
          description="Add owners, labels, and due dates so every task has a clear next move."
        />
        <StepCard
          icon={<Rocket className="w-8 h-8 text-muted-foreground" />}
          step="03"
          title="Launch Goals"
          description="Track progress with real-time updates and a weekly summary that feels effortless."
        />
      </div>
    </section>
  );
}
