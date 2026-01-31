"use client";

import { Card } from "@/components/reusable/card";
import { ArrowRight } from "lucide-react";
import React from "react";

interface StepCardProps {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}

export function StepCard({ icon, step, title, description }: StepCardProps) {
  return (
    <Card className="flex flex-col gap-6 p-10 hover:translate-y-[-8px] transition-transform cursor-pointer group">
      <div className="flex items-center justify-between">
        <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05)] flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-4xl font-black text-zinc-100 group-hover:text-primary/10 transition-colors uppercase italic">{step}</span>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground font-medium leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 flex items-center gap-2 text-primary font-bold opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
        Learn more <ArrowRight className="w-4 h-4" />
      </div>
    </Card>
  );
}
