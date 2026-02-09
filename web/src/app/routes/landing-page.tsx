import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { SecuritySection } from '@/components/landing/security-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { FAQSection } from '@/components/landing/faq-section'
import { CTASection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { useNavigate } from 'react-router'
import { useAuth } from '@/hooks/use-auth'

export function LandingPage() {
  const navigate = useNavigate()
  const { isAuthenticated, isPending } = useAuth()

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/home')
    } else {
      navigate('/signup')
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background surface-grid">
      <main className="flex-1 flex flex-col items-center py-16 md:py-20 max-w-6xl mx-auto gap-24">
        <HeroSection onGetStarted={handleGetStarted} isPending={isPending} />
        <FeaturesSection />
        <HowItWorksSection />
        <SecuritySection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection onGetStarted={handleGetStarted} isPending={isPending} />
      </main>
      <LandingFooter />
    </div>
  )
}
