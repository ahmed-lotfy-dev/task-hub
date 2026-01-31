"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleGetStarted = () => {
    if (session) {
      router.push("/home");
    } else {
      router.push("/signup");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 flex flex-col items-center px-6 py-20 max-w-7xl mx-auto gap-40">
        <HeroSection onGetStarted={handleGetStarted} isPending={isPending} />
        <HowItWorksSection />
        <PricingSection />
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      <LandingFooter />
    </div>
  );
}
