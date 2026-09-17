import { Hero } from "@/components/home/hero";
import { TrustStrip } from "@/components/home/trust-strip";
import { WhyPartnerSection } from "@/components/home/why-partner/why-partner-section";
import { AiDifferenceSection } from "@/components/home/ai-difference/ai-difference-section";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <TrustStrip />
      <WhyPartnerSection />
      <AiDifferenceSection />
    </main>
  );
}
