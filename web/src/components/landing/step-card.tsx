"use client";

import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface StepCardProps {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}

export function StepCard({ icon, step, title, description }: StepCardProps) {
  return (
    <Card className="flex flex-col gap-6 p-8 hover:-translate-y-1 transition-transform cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <span className="text-3xl font-black text-muted-foreground/30 group-hover:text-primary/10 transition-colors uppercase italic">
          {step}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
      </div>
      <div className="mt-2 flex items-center gap-2 text-primary font-semibold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
        Learn more <ArrowRight className="w-4 h-4" />
      </div>
    </Card>
  );
}
