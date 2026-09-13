import { ArrowRight } from "lucide-react";
import Velaris from "@/components/ui/velaris";
import { GrowthSearchDemo } from "./growth-search-demo";

// Darker, deeper tints of the brand blue/green — no light/bright shades,
// so the gradient never washes out white text over it (see project memory
// on the hero for why: bright colors landing behind the headline broke
// contrast during animation).
const HERO_GRADIENT_COLORS = ["#052E63", "#0A4FB0", "#12862B", "#03080F"];
const HERO_GRADIENT_BG = "#03020F";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gn-black">
      <Velaris
        bg={HERO_GRADIENT_BG}
        colors={HERO_GRADIENT_COLORS}
        speed={1.4}
        grain={0.25}
        className="absolute inset-0"
      />

      <div className="gn-hero-grid pointer-events-none absolute inset-0" aria-hidden />

      {/* Permanent readability scrim — keeps the text zone dark regardless
          of where the shader's bright color pockets drift to */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 62% 60% at 50% 38%, rgba(3,2,15,0.6) 0%, rgba(3,2,15,0.3) 45%, transparent 75%)",
        }}
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gn-black"
        aria-hidden
      />

      {/* Content */}
      <div className="relative mx-auto flex max-w-[1000px] flex-col items-center px-6 pt-28 pb-16 text-center sm:pt-36 sm:pb-20 lg:pt-44 lg:pb-24">
        <span
          className="gn-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-white/80"
          style={{ animationDelay: "0.05s" }}
        >
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--gradient-gn-primary)" }}
          />
          AI-NATIVE DIGITAL TRANSFORMATION
        </span>

        <h1
          className="gn-fade-up max-w-[880px] text-[40px] font-medium leading-[1.08] tracking-tight text-white sm:text-[56px] lg:text-[72px]"
          style={{ animationDelay: "0.15s" }}
        >
          Build the systems behind intelligent growth.
        </h1>

        <p
          className="gn-fade-up mt-6 max-w-[620px] text-base leading-7 text-white/65 sm:text-lg sm:leading-8"
          style={{ animationDelay: "0.25s" }}
        >
          Growth Natives connects AI, data, technology, marketing, and people
          into one operating system — turning fragmented growth activity into
          measurable outcomes.
        </p>

        <div
          className="gn-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row"
          style={{ animationDelay: "0.35s" }}
        >
          <a
            href="/talk-to-an-expert"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white transition-transform hover:scale-[1.03]"
            style={{ background: "var(--gradient-gn-primary)" }}
          >
            Talk to an Expert
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="/solutions"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[15px] font-semibold text-white/90 transition-colors hover:border-white/40 hover:bg-white/5"
          >
            See How We Work
          </a>
        </div>

        {/* Signature animation slot */}
        <div
          className="gn-fade-up mt-16 w-full sm:mt-20"
          style={{ animationDelay: "0.45s" }}
        >
          <GrowthSearchDemo />
        </div>
      </div>
    </section>
  );
}
