import Image from "next/image";
import { ScrollRevealHeading } from "@/components/ui/scroll-reveal-heading";
import { AWARDS, AWARDS_SECTION } from "./content";

// Hover wash: GN Blue rising from 0% at the top to 100% at the bottom, with
// intermediate stops so the ramp is smooth rather than a linear-looking band.
const BLUE_WASH =
  "bg-[linear-gradient(180deg,rgba(0,116,248,0)_0%,rgba(0,116,248,0.1)_40%,rgba(0,116,248,0.4)_72%,#0074F8_100%)]";

export function AwardsSection() {
  return (
    <section
      aria-labelledby="awards-heading"
      className="relative bg-gn-black py-28 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <p className="text-[14px] font-semibold text-gn-blue">
              {AWARDS_SECTION.eyebrow}
            </p>
            <ScrollRevealHeading
              id="awards-heading"
              className="mt-4 max-w-[420px] text-[32px] font-medium leading-[1.15] tracking-tight text-white sm:text-[40px]"
            >
              {AWARDS_SECTION.heading}
            </ScrollRevealHeading>
          </div>
          <p className="max-w-[560px] text-base leading-7 text-white/65 sm:text-[17px] sm:leading-8 lg:col-span-6 lg:col-start-7 lg:pt-1">
            {AWARDS_SECTION.description}
          </p>
        </div>

        {/* 1px gaps over a tinted backdrop draw the hairline dividers, so the
            grid never shifts on hover. */}
        <ul className="mt-16 grid grid-cols-2 gap-px bg-white/[0.08] sm:grid-cols-3 lg:mt-24 lg:grid-cols-6">
          {AWARDS.map((award) => (
            <li
              key={award.id}
              className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden bg-gn-black p-6 lg:min-h-[240px] lg:p-7"
            >
              {/* hover: blue wash only — no image. Shown faintly on touch, where there is no hover. */}
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 [@media(hover:none)]:opacity-40 ${BLUE_WASH}`}
              />

              <div className="relative h-14 w-full">
                <Image
                  src={award.logo}
                  alt=""
                  fill
                  sizes="180px"
                  className="object-contain object-left opacity-55 grayscale invert transition-opacity duration-500 ease-out group-hover:opacity-100"
                />
              </div>

              <p className="relative mt-10 text-[15px] font-semibold leading-snug text-white/55 transition-colors duration-500 ease-out group-hover:text-white">
                {award.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
