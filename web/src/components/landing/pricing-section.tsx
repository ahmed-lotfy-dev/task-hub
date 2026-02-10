"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PricingCard } from "./pricing-card";

export function PricingSection() {
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
    <section id="pricing" className="w-full flex flex-col gap-16">
      <motion.div className="text-center flex flex-col gap-4" {...headerMotionProps}>
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
          Flexible plans for teams of any size
        </h2>
        <p className="text-lg text-muted-foreground">
          Start free, then scale when you are ready. Everything stays simple and predictable.
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
            title: "Starter",
            price: "0",
            description: "Perfect for personal projects and small teams.",
            features: ["Up to 3 boards", "Basic automation", "Email support"],
          },
          {
            title: "Team",
            price: "12",
            popular: true,
            description: "Ideal for growing teams and startups.",
            features: ["Unlimited boards", "Team permissions", "Advanced automation", "Priority support"],
          },
          {
            title: "Enterprise",
            price: "29",
            description: "Built for organizations with advanced needs.",
            features: ["SAML SSO", "Audit logs", "Dedicated success manager"],
          },
        ].map((plan) => (
          <motion.div
            key={plan.title}
            variants={{
              hidden: { opacity: 0, y: 18 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
          >
            <PricingCard {...plan} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
