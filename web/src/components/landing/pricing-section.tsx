"use client";

import { PricingCard } from "./pricing-card";

export function PricingSection() {
  return (
    <section id="pricing" className="w-full flex flex-col gap-16">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-4xl font-extrabold text-foreground tracking-tight">
          Flexible plans for teams of any size
        </h2>
        <p className="text-lg text-muted-foreground">
          Start free, then scale when you are ready. Everything stays simple and predictable.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <PricingCard
          title="Starter"
          price="0"
          description="Perfect for personal projects and small teams."
          features={["Up to 3 boards", "Basic automation", "Email support"]}
        />
        <PricingCard
          title="Team"
          price="12"
          popular
          description="Ideal for growing teams and startups."
          features={["Unlimited boards", "Team permissions", "Advanced automation", "Priority support"]}
        />
        <PricingCard
          title="Enterprise"
          price="29"
          description="Built for organizations with advanced needs."
          features={["SAML SSO", "Audit logs", "Dedicated success manager"]}
        />
      </div>
    </section>
  );
}
