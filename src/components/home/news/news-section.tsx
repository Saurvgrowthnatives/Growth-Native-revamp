import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { ScrollRevealHeading } from "@/components/ui/scroll-reveal-heading";
import { NEWS_ITEMS, NEWS_SECTION } from "./content";

/**
 * Voiceflow's "New from Voiceflow" rail (voiceflow.com): a small label and
 * heading, then three equal cards — each a white panel with an inset cover
 * image, a two-line-clamped title and a "Read more →" link. The whole card
 * is the link, and it lifts on hover; the grid steps 3 → 2 → 1 column at the
 * reference's own breakpoints.
 */
export function NewsSection() {
  return (
    <section
      aria-labelledby="news-heading"
      className="relative bg-[#F4F7FA] py-24 sm:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1320px] px-6">
        <p className="text-[14px] font-semibold text-gn-blue">
          {NEWS_SECTION.eyebrow}
        </p>
        <ScrollRevealHeading
          id="news-heading"
          className="mt-4 max-w-[620px] text-[32px] font-medium leading-[1.15] tracking-tight text-gn-black sm:text-[40px]"
        >
          {NEWS_SECTION.heading}
        </ScrollRevealHeading>
        <p className="mt-4 max-w-[560px] text-base leading-7 text-gn-dark-grey sm:text-[17px] sm:leading-8">
          {NEWS_SECTION.body}
        </p>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {NEWS_ITEMS.map((item) => (
            <li key={item.id} className="gn-news-card">
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-xl p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
              >
                <div className="relative aspect-[1.485/1] w-full overflow-hidden rounded-lg bg-gn-black">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-gn-blue">
                    {item.category}
                  </p>
                  {/* clamped to two lines, as in the reference */}
                  <h3 className="gn-news-title mt-2 text-[18px] font-medium leading-[1.35] tracking-tight text-gn-black">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-gn-dark-grey/80">
                    {item.date} · {item.readTime}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[14px] font-medium text-gn-blue">
                    {NEWS_SECTION.readMoreText}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                      aria-hidden
                    />
                    <span className="sr-only">
                      about {item.title} (opens growthnatives.com)
                    </span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
