"use client";

import { Sparkles, Layers, Calendar, Shield, Wand2, Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const features = [
  {
    icon: Sparkles,
    title: "Clarity-first boards",
    description: "Minimal columns, clear ownership, and a layout that stays readable.",
  },
  {
    icon: Layers,
    title: "Flexible workflows",
    description: "Create spaces for product, design, or ops without extra setup.",
  },
  {
    icon: Calendar,
    title: "Timeline awareness",
    description: "See what is due today, next, and later with quick filters.",
  },
  {
    icon: Inbox,
    title: "Unified inbox",
    description: "Every update, mention, and decision in one place.",
  },
  {
    icon: Wand2,
    title: "Smart automation",
    description: "Auto-assign, tag, and route work with lightweight rules.",
  },
  {
    icon: Shield,
    title: "Enterprise ready",
    description: "Role based access, audit trails, and secure by default.",
  },
];

export function FeaturesSection() {
  return (
    <section className="w-full flex flex-col gap-16">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
          Everything your team needs, nothing it does not
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A minimalist surface with just enough color to keep momentum and focus.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.08 } },
        }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <Card className="p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
