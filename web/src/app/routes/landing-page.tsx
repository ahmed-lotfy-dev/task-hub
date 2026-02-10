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
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Button } from '@/components/ui/button'

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
      <header className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between gap-4">
        <div className="text-sm font-semibold tracking-tight text-foreground">
          Task Hub
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <a
            className="hover:text-foreground transition-colors"
            href="#features"
          >
            Features
          </a>
          <a
            className="hover:text-foreground transition-colors"
            href="#how-it-works"
          >
            How it works
          </a>
          <a
            className="hover:text-foreground transition-colors"
            href="#pricing"
          >
            Pricing
          </a>
          <a className="hover:text-foreground transition-colors" href="#faq">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Sign in
          </Button>
          <Button size="sm" onClick={handleGetStarted} disabled={isPending}>
            Get started
          </Button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center py-16 md:py-20 max-w-360 mx-auto px-4 sm:px-6 lg:px-8 gap-24">
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
