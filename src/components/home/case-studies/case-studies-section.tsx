import Image from "next/image";
import { ScrollRevealHeading } from "@/components/ui/scroll-reveal-heading";
import { CASE_STUDIES, CASE_STUDIES_SECTION } from "./content";

/**
 * Papermark "Real impact for real teams" rail: three image cards in a row,
 * the first open by default. Hovering (or focusing) a card opens it and
 * closes the rest — the card grows, its quote enlarges and lifts, and the
 * "Watch story" link fades in. All of it is CSS (`.gn-impact-*` in
 * globals.css), so there's no JS or scroll work involved. The section sits
 * on white; the cards keep their own dark gradient so the quote stays
 * readable over any image.
 *
 * Below 1024px the rail stacks and every card shows its quote and link,
 * since touch has no hover.
 */
export function CaseStudiesSection() {
  return (
    <section
      aria-labelledby="case-studies-heading"
      className="relative bg-white py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <ScrollRevealHeading
              id="case-studies-heading"
              className="max-w-[620px] text-[32px] font-medium leading-[1.15] tracking-tight text-gn-black sm:text-[40px]"
            >
              {CASE_STUDIES_SECTION.heading}
            </ScrollRevealHeading>
            <p className="mt-4 max-w-[560px] text-base leading-7 text-gn-dark-grey sm:text-[17px] sm:leading-8">
              {CASE_STUDIES_SECTION.subtitle}
            </p>
          </div>
          <a
            href={CASE_STUDIES_SECTION.moreHref}
            className="inline-flex w-fit shrink-0 items-center rounded-full border border-gn-black/15 px-6 py-3 text-[14px] font-medium text-gn-black transition-colors hover:bg-gn-black/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
          >
            {CASE_STUDIES_SECTION.moreLabel}
          </a>
        </div>

        <ul className="gn-impact-rail mt-12">
          {CASE_STUDIES.map((study, i) => (
            <li
              key={study.id}
              className={`gn-impact-card ${i === 0 ? "is-active" : ""}`}
            >
              <Image
                src={study.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 800px, 100vw"
                className="gn-impact-image object-cover"
              />
              <p className="gn-impact-client">
                {study.client} · {study.person}
              </p>
              <p className="gn-impact-label">{study.quote}</p>
              <span className="gn-impact-link" aria-hidden="true">
                Watch story <span>→</span>
              </span>
              {/* the whole card is the link, as in the reference */}
              <a
                href={study.storyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="gn-impact-hit"
              >
                <span className="sr-only">
                  Watch the {study.client} story (opens YouTube)
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
