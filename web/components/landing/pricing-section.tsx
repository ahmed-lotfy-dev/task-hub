"use client";

import { PricingCard } from "./pricing-card";
import React from "react";

export function PricingSection() {
  return (
    <section className="w-full flex flex-col gap-20">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-4xl font-extrabold text-[#2D3748] tracking-tight">Flexible Plans for Every Team</h2>
        <p className="text-lg text-muted-foreground font-medium">Start for free, scale when you're ready.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <PricingCard
          title="Personal"
          price="0"
          description="Perfect for individuals and side projects."
          features={["Unlimited Boards", "3 Team Members", "100 Cards", "Basic AI Sync"]}
        />
        <PricingCard
          title="Pro"
          price="12"
          popular
          description="Best for growing teams and startups."
          features={["Unlimited Members", "Advanced AI Features", "Gantt & Calendar Views", "Priority Support"]}
        />
        <PricingCard
          title="Business"
          price="29"
          description="For organizations needing enterprise scale."
          features={["SAML/SSO", "Advanced RBAC", "Audit Logs", "Dedicated Manager"]}
        />
      </div>
    </section>
  );
}
