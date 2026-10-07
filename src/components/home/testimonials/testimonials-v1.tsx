"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { TESTIMONIALS, TESTIMONIALS_SECTION, type Testimonial } from "./content";

// Supercut cycles every 4s, but its quotes are a line or two; these run three
// to five sentences, so each gets long enough to actually be read.
const AUTOPLAY_MS = 9000;
const WORD_STAGGER_S = 0.018;
const MAX_WORD_DELAY_S = 1.1;

/**
 * Supercut "customer highlight" (supercut.ai): a framed two-column panel —
 * quote, attribution and CTAs on the left, a full-bleed portrait on the right
 * that fades into the panel — over a row of four client tabs. The active tab
 * carries a thin progress line while the testimonials auto-advance.
 *
 * Autoplay only runs while the section is on screen, pauses while the
 * pointer or keyboard focus is inside the panel, and stops for good once the
 * visitor picks a tab. Reduced motion: no autoplay, no word stagger.
 */
export function TestimonialsV1() {
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [paused, setPaused] = useState(false);
  const [userChose, setUserChose] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => setReduced(query.matches);
    evaluate();
    query.addEventListener("change", evaluate);
    return () => query.removeEventListener("change", evaluate);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.25 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const playing = inView && !paused && !userChose && !reduced;

  // One timeout per slide (re-armed whenever the slide or play state
  // changes), so every testimonial gets its full time on screen — and the
  // progress line, keyed the same way, always restarts from zero with it.
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(
      () => setActive((i) => (i + 1) % TESTIMONIALS.length),
      AUTOPLAY_MS,
    );
    return () => window.clearTimeout(id);
  }, [playing, active]);

  function choose(i: number) {
    setActive(i);
    setUserChose(true);
  }

  function onTabKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const last = TESTIMONIALS.length - 1;
    const next =
      e.key === "ArrowRight"
        ? (active + 1) % TESTIMONIALS.length
        : e.key === "ArrowLeft"
          ? (active - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    choose(next);
    tabRefs.current[next]?.focus();
  }

  const t = TESTIMONIALS[active];

  return (
    <section
      ref={rootRef}
      aria-labelledby="testimonials-heading"
      className="relative bg-gn-black py-16 text-white sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1320px] px-6">
        {/* no visible heading — kept for screen readers and heading order */}
        <h2 id="testimonials-heading" className="sr-only">
          {TESTIMONIALS_SECTION.heading}
        </h2>

        <div
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#070c13]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setPaused(false);
            }
          }}
        >
          <div
            id="testimonial-panel"
            role="tabpanel"
            aria-labelledby={`testimonial-tab-${active}`}
            aria-live={playing ? "off" : "polite"}
            className="grid lg:h-[540px] lg:grid-cols-2"
          >
            <div className="order-2 flex flex-col justify-center px-6 py-10 sm:px-10 lg:order-1 lg:px-14 lg:py-12">
              <Quote key={t.id} testimonial={t} animate={!reduced} />
            </div>

            <div className="relative order-1 aspect-[4/3] overflow-hidden lg:order-2 lg:aspect-auto lg:h-full">
              <div key={t.id} className="gn-crossfade absolute inset-0">
                <Image
                  src={t.image}
                  alt={`${t.name}, ${t.role} at ${t.company}`}
                  fill
                  sizes="(min-width: 1024px) 660px, 100vw"
                  // a touch over 1x crops away the source images' baked-in
                  // rounded corners
                  className="scale-[1.06] object-cover object-top"
                />
              </div>
              {/* fades the portrait into the panel: from the bottom on
                  mobile; on desktop a straight left-to-right ramp, solid
                  panel colour at the left edge (0%) to clear at the right
                  edge (100%) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(7,12,19,0.95)_0%,rgba(7,12,19,0)_55%)] lg:bg-[linear-gradient(90deg,rgba(7,12,19,1)_0%,rgba(7,12,19,0)_100%)]"
              />
            </div>
          </div>

          {/* desktop: four client tabs */}
          <div
            role="tablist"
            aria-label="Client testimonials"
            onKeyDown={onTabKeyDown}
            className="hidden border-t border-white/10 lg:grid lg:h-[120px] lg:grid-cols-4"
          >
            {TESTIMONIALS.map((item, i) => {
              const selected = i === active;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`testimonial-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="testimonial-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(i)}
                  className={`relative flex items-center justify-center px-6 transition-[background-color] duration-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-gn-blue ${
                    i > 0 ? "border-l border-white/10" : ""
                  } ${
                    selected
                      ? "bg-[linear-gradient(180deg,rgba(217,217,217,0.07)_0%,rgba(115,115,115,0.07)_100%)]"
                      : "hover:bg-white/[0.03]"
                  }`}
                >
                  {selected && playing ? (
                    <span
                      key={`${active}-progress`}
                      aria-hidden
                      className="gn-progress absolute inset-x-0 top-0 h-px bg-white"
                      style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                    />
                  ) : null}
                  {selected && !playing ? (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-px bg-white/60"
                    />
                  ) : null}
                  <span
                    className={`text-[20px] font-semibold tracking-tight transition-opacity duration-300 ${
                      selected ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    {item.company}
                  </span>
                </button>
              );
            })}
          </div>

          {/* mobile: dots */}
          <div className="flex justify-center gap-2 pb-8 lg:hidden">
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => choose(i)}
                aria-label={`Show ${item.name}, ${item.company}`}
                aria-current={i === active ? "true" : undefined}
                className={`h-2 w-2 rounded-full transition-colors duration-200 ${
                  i === active ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** The quote, word by word: the opening sentence in white, the rest muted. */
function Quote({
  testimonial,
  animate,
}: {
  testimonial: Testimonial;
  animate: boolean;
}) {
  let index = 0;
  const renderWords = (text: string) =>
    text.split(" ").map((word, i, all) => {
      const delay = Math.min(index++ * WORD_STAGGER_S, MAX_WORD_DELAY_S);
      return (
        <span key={i}>
          <span
            className={animate ? "gn-word inline-block" : "inline-block"}
            style={animate ? { animationDelay: `${delay}s` } : undefined}
          >
            {word}
          </span>
          {i < all.length - 1 ? " " : null}
        </span>
      );
    });

  return (
    <figure className="max-w-[540px]">
      <blockquote className="text-[18px] font-medium leading-[1.55] tracking-tight text-white">
        {renderWords(testimonial.highlight)}{" "}
        <span className="text-white/45">{renderWords(testimonial.rest)}</span>
      </blockquote>
      <figcaption className="mt-6 text-[14px] text-white/50">
        {testimonial.name} — {testimonial.role}, {testimonial.company}
      </figcaption>
    </figure>
  );
}
