"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

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
    <Card
      className={cn(
        "p-8 flex flex-col gap-8 relative hover:-translate-y-1 transition-transform cursor-pointer",
        popular ? "border-2 border-primary shadow-lg" : "border border-border"
      )}
    >
      {popular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
          Most Popular
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-5xl font-black tracking-tighter">${price}</span>
        <span className="text-muted-foreground font-semibold">/mo</span>
      </div>
      <Button
        variant={popular ? "default" : "outline"}
        className="w-full py-4 text-base font-semibold cursor-pointer"
        onClick={onSelect}
      >
        Get Started
      </Button>
      <div className="flex flex-col gap-4 mt-2">
        {features.map(feature => (
          <div key={feature} className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-primary" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
