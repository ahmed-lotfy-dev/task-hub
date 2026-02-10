"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { apiFetch } from "@/lib/api";
import type { Testimonial } from "@taskflow/shared";
import { useEffect, useState } from "react";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    apiFetch<Testimonial[]>("/api/testimonials")
      .then((data) => setTestimonials(data))
      .finally(() => setLoaded(true));
  }, []);

  const hasTestimonials = testimonials.length > 0;

  if (!loaded || !hasTestimonials) {
    return null;
  }

  return (
    <section className="w-full flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Loved by teams that move fast
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This space will highlight real stories from teams using Task Hub.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <Card key={item.id} className="p-6">
            <div className="flex items-center gap-1 text-primary">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 text-sm text-foreground leading-relaxed">
              "{item.quote}"
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{item.name}</span>
              {item.role ? ` - ${item.role}` : ""}
              {item.company ? `, ${item.company}` : ""}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
