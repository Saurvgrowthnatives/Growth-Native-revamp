import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { WhyPartnerSection } from "@/components/home/why-partner/why-partner-section";
import { AiDifferenceSection } from "@/components/home/ai-difference/ai-difference-section";
import { WhatWeDoSection } from "@/components/home/what-we-do/what-we-do-section";
import { AwardsSection } from "@/components/home/awards/awards-section";
import { CaseStudiesSection } from "@/components/home/case-studies/case-studies-section";
import { TestimonialsSection } from "@/components/home/testimonials/testimonials-section";
import { ScrollRefresh } from "@/components/ui/scroll-refresh";
import { SmoothScroll } from "@/components/ui/smooth-scroll";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TrustStrip />
      <WhyPartnerSection />
      <AiDifferenceSection />
      <WhatWeDoSection />
      <AwardsSection />
      <CaseStudiesSection />
      <TestimonialsSection />
      <SmoothScroll />
      <ScrollRefresh />
    </main>
  );
}
