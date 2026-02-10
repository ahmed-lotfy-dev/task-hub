"use client";

import { Layout, MousePointer2, Rocket } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { StepCard } from "./step-card";

export function HowItWorksSection() {
  const shouldReduceMotion = useReducedMotion();
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
    <section id="how-it-works" className="w-full flex flex-col gap-16">
      <motion.div className="text-center flex flex-col gap-4" {...headerMotionProps}>
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
          Simple flows that keep teams aligned
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Clear steps, fewer clicks, and a workspace that stays tidy even when work moves fast.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-8"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12 } },
        }}
        {...gridMotionProps}
      >
        {[
          {
            icon: <Layout className="w-8 h-8 text-primary" />,
            step: "01",
            title: "Create Workspace",
            description: "Spin up boards and lanes in seconds, then invite your team with one link.",
          },
          {
            icon: <MousePointer2 className="w-8 h-8 text-foreground" />,
            step: "02",
            title: "Assign & Tag",
            description: "Add owners, labels, and due dates so every task has a clear next move.",
          },
          {
            icon: <Rocket className="w-8 h-8 text-muted-foreground" />,
            step: "03",
            title: "Launch Goals",
            description:
              "Track progress with real-time updates and a weekly summary that feels effortless.",
          },
        ].map((step) => (
          <motion.div
            key={step.step}
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
          >
            <StepCard {...step} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
