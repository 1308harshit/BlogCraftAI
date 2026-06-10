import { LandingNav, LandingFooter, LandingFAQ } from '@/components/landing/nav-footer'
import { LandingHero, LandingFeatures } from '@/components/landing/hero'
import { LandingPricing } from '@/components/landing/pricing'
import {
  LandingWorkflows,
  LandingIntegrations,
  LandingTestimonials,
  LandingSEO,
} from '@/components/landing/sections'

export default function HomePage() {
  return (
    <>
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingWorkflows />
        <LandingSEO />
        <LandingTestimonials />
        <LandingIntegrations />
        <LandingPricing />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </>
  )
}
