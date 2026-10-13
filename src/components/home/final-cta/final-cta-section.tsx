import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { ScrollRevealHeading } from "@/components/ui/scroll-reveal-heading";
import { FINAL_CTA } from "./content";

/**
 * Closing CTA (Stripe-style banner): one wide panel with the heading and a
 * small white pill button over full-bleed art, top-left.
 *
 * The art is a placeholder — a single linear gradient running GN Black at 0%
 * to GN Blue at 100%, so the dark end sits under the text. Dropping a real
 * image path into FINAL_CTA.image replaces it.
 */
export function FinalCtaSection() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative bg-white pb-24 pt-8 sm:pb-28 lg:pb-32"
    >
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="relative isolate overflow-hidden rounded-2xl">
          {/* placeholder art: linear gradient, 0% -> 100% */}
          {FINAL_CTA.image ? (
            <Image
              src={FINAL_CTA.image}
              alt=""
              fill
              sizes="(min-width: 1320px) 1272px, 100vw"
              className="-z-10 object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#03080F_0%,#0074F8_100%)]"
            />
          )}

          <div className="flex min-h-[260px] flex-col justify-center gap-6 px-7 py-12 sm:min-h-[300px] sm:px-12 lg:min-h-[340px] lg:px-16">
            <ScrollRevealHeading
              id="final-cta-heading"
              className="max-w-[18ch] text-[30px] font-medium leading-[1.15] tracking-tight text-white sm:text-[38px] lg:text-[44px]"
            >
              {FINAL_CTA.heading}
            </ScrollRevealHeading>

            <a
              href={FINAL_CTA.cta.href}
              className="group inline-flex h-11 w-fit items-center gap-1 rounded-md bg-white px-5 text-[15px] font-medium text-gn-black transition-colors duration-200 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {FINAL_CTA.cta.label}
              <ChevronRight
                className="h-4 w-4 opacity-50 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
