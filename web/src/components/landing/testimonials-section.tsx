"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "We moved three teams in one week. The UI is calm, the speed is real, and the focus is back.",
    name: "Ava Thomas",
    role: "Head of Product",
  },
  {
    quote:
      "Task Hub feels clean and structured. Our boards are finally readable and decisions happen faster.",
    name: "Marco Ruiz",
    role: "Engineering Manager",
  },
  {
    quote:
      "The mix of minimal design and smart automation is exactly what our design team wanted.",
    name: "Lina Chen",
    role: "Design Lead",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Loved by teams that move fast
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Real teams, real work, and a calmer way to ship.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <Card key={item.name} className="p-6">
            <div className="flex items-center gap-1 text-primary">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm text-foreground leading-relaxed">"{item.quote}"</p>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{item.name}</span> - {item.role}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
