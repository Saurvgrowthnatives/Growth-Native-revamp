import { ArrowRight } from "lucide-react";
import { AI_FEATURES } from "./content";
import { FEATURE_ICONS } from "./icons";

/**
 * Mobile / reduced-motion fallback, and what the server renders: the same
 * nine features on the same dark surface, stacked, with no pinned track.
 */
export function AiDifferenceStatic() {
  return (
    <div className="bg-gn-black px-6 py-20 sm:py-24">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gn-blue">
          Our AI Difference
        </p>
        <h2 className="mt-4 max-w-[520px] text-[28px] font-medium leading-[1.2] tracking-tight text-white sm:text-[34px]">
          The AI Engine Behind Everything We Do
        </h2>

        <ul className="mt-12 flex flex-col divide-y divide-white/10">
          {AI_FEATURES.map((feature, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <li key={feature.id} className="flex gap-5 py-7 first:pt-0">
                <Icon
                  className="mt-1 h-5 w-5 shrink-0 text-gn-blue"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  <h3 className="text-[19px] font-semibold leading-snug tracking-tight text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-[1.65] text-white/55">
                    {feature.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>

        <a
          href="/ai-labs"
          className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[14px] font-medium text-white"
        >
          Explore More
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </a>
      </div>
    </div>
  );
}
