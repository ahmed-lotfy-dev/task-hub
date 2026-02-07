import { HeroSection } from '@/components/landing/hero-section'
import { HowItWorksSection } from '@/components/landing/how-it-works-section'
import { PricingSection } from '@/components/landing/pricing-section'
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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <main className="flex-1 flex flex-col items-center py-20 max-w-7xl mx-auto gap-40">
        <HeroSection onGetStarted={handleGetStarted} isPending={isPending} />
        <HowItWorksSection />
        <PricingSection />
        <CTASection onGetStarted={handleGetStarted} />
      </main>
      <LandingFooter />
    </div>
  )
}
