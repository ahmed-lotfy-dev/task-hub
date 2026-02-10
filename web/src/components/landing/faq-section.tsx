"use client";

import { motion, useReducedMotion } from "framer-motion";

const faqs = [
  {
    question: "Is Task Hub free to start?",
    answer: "Yes. The Starter plan is free and includes the core workflow features.",
  },
  {
    question: "Can I invite my whole team?",
    answer: "Invite as many members as you want on the Team plan or higher.",
  },
  {
    question: "Do you support single sign-on?",
    answer: "Yes, SAML SSO is available on Enterprise.",
  },
  {
    question: "Does Task Hub work on mobile?",
    answer: "The app is fully responsive and optimized for mobile and tablet.",
  },
  {
    question: "How secure is my data?",
    answer: "We use encryption in transit and at rest with strict access control policies.",
  },
];

export function FAQSection() {
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
    <section id="faq" className="w-full flex flex-col gap-12">
      <motion.div className="text-center flex flex-col gap-4" {...headerMotionProps}>
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Frequently asked questions
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Everything you need to know before getting started.
        </p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
        {...gridMotionProps}
      >
        {faqs.map((item) => (
          <motion.div
            key={item.question}
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
            }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <h3 className="text-sm font-semibold text-foreground">{item.question}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
