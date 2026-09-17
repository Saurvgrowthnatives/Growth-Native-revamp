import { ArrowRight } from "lucide-react";
import { AI_FEATURES } from "./content";

/** Mobile / reduced-motion fallback — same nine features, no scroll track. */
export function AiDifferenceStatic() {
  return (
    <section className="bg-white px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[640px]">
        <p className="text-[15px] text-gn-blue">Our AI Difference</p>
        <p className="mt-2 text-[20px] leading-[1.4] text-gn-black/80">
          The AI Engine Behind Everything We Do
        </p>

        <div className="mt-10 divide-y divide-black/5">
          {AI_FEATURES.map((feature) => (
            <div key={feature.id} className="py-6 first:pt-0">
              <h3 className="text-[22px] font-semibold leading-tight tracking-tight text-gn-black">
                {feature.title}
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-gn-dark-grey">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <a
          href="/ai-labs"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-gn-black/15 px-5 py-2.5 text-[14px] font-medium text-gn-black"
        >
          Explore More
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </a>
      </div>
    </section>
  );
}
