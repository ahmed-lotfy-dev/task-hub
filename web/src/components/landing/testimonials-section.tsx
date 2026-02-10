"use client";

import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import type { Testimonial } from "@taskflow/shared";
import { useEffect, useState } from "react";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loaded, setLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    apiFetch<Testimonial[]>("/api/testimonials")
      .then((data) => setTestimonials(data))
      .finally(() => setLoaded(true));
  }, []);

  const hasTestimonials = testimonials.length > 0;

  if (!loaded || !hasTestimonials) {
    return null;
  }

  const headerMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: "easeOut" },
      };
  const gridMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: "hidden",
        whileInView: "show",
        viewport: { once: true, margin: "-100px" },
      };

  return (
    <section id="testimonials" className="w-full flex flex-col gap-12">
      <motion.div className="text-center flex flex-col gap-4" {...headerMotionProps}>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Loved by teams that move fast
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          This space will highlight real stories from teams using Task Hub.
        </p>
      </motion.div>
      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12 } },
        }}
        {...gridMotionProps}
      >
        {testimonials.map((item) => (
          <motion.div
            key={item.id}
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
          >
            <Card className="p-6">
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
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
