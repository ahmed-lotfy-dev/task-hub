"use client";

import { Card } from "@/components/reusable/card";
import { Button } from "@/components/reusable/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import React from "react";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  onSelect?: () => void;
}

export function PricingCard({
  title,
  price,
  description,
  features,
  popular = false,
  onSelect
}: PricingCardProps) {
  return (
    <Card className={cn(
      "p-10 flex flex-col gap-8 relative hover:translate-y-[-8px] transition-transform cursor-pointer",
      popular ? "border-2 border-primary shadow-xl" : "border border-zinc-50 shadow-lg"
    )}>
      {popular && (
        <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground font-medium text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tighter">${price}</span>
        <span className="text-muted-foreground font-bold">/mo</span>
      </div>
      <Button
        variant={popular ? "primary" : "white"}
        className="w-full py-4 text-base font-bold shadow-md cursor-pointer"
        onClick={onSelect}
      >
        Get Started
      </Button>
      <div className="flex flex-col gap-4 mt-4">
        {features.map(feature => (
          <div key={feature} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-secondary" />
            </div>
            <span className="text-sm font-medium text-zinc-600">{feature}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
