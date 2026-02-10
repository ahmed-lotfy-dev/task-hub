"use client";

import { ShieldCheck, Lock, KeyRound } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  {
    icon: ShieldCheck,
    title: "Audit ready",
    description: "Track every change with immutable activity logs.",
  },
  {
    icon: Lock,
    title: "Data protection",
    description: "Encryption at rest and in transit with strict access controls.",
  },
  {
    icon: KeyRound,
    title: "SSO and access",
    description: "SAML SSO and granular permissions for larger teams.",
  },
];

export function SecuritySection() {
  return (
    <section id="security" className="w-full flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Security and trust built in
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your work deserves enterprise-grade security with a startup-friendly setup.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title} className="p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
