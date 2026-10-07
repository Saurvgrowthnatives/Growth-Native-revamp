"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronRight } from "lucide-react";
import { TESTIMONIALS, TESTIMONIALS_SECTION } from "./content";

// Steep's own timings: a 300ms fade-out before the content swaps, and a
// 0.6s word rise staggered 0.08s apart on first reveal.
const SWAP_MS = 300;
const WORD_STAGGER_S = 0.08;
const MAX_WORD_DELAY_S = 1.2;
// How long each testimonial stays before the loader line hands over to the
// next company. The pull quote is a single sentence, so this is plenty.
const AUTOPLAY_MS = 6000;

/**
 * Steep "customer story" (steep.app): a pale GN-blue surface with the pull
 * quote, attribution and two CTAs on the left over a row of client tabs, and
 * a square full-colour portrait on the right.
 *
 * Choosing a tab slides the indicator at once, fades the content out, swaps
 * it, and fades it back in. On first scroll into view the quote's words rise
 * out of a mask and the rest follows.
 *
 * Autoplay: the active tab's line is a loader — a CSS animation that fills
 * over AUTOPLAY_MS and, when it ends, advances to the next company. Hovering
 * (or focusing) the testimonial pauses that animation in place, so the line
 * freezes and resumes from the same point; it is also paused while the
 * section is off screen. Picking a tab restarts the loader from that tab.
 * Reduced motion: no autoplay, a static line, and the final layout.
 *
 * The pull quote is each testimonial's opening sentence — an exact excerpt
 * of the live copy, not a rewrite.
 */
export function TestimonialsV2() {
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swapTimer = useRef<number | undefined>(undefined);

  // `target` moves the tab + indicator immediately; `shown` swaps the
  // content once it has faded out, as Steep does.
  const [target, setTarget] = useState(0);
  const [shown, setShown] = useState(0);
  const [fading, setFading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Keeps observing (not just once): `revealed` latches true on first entry
  // for the intro motion, while `inView` tracks visibility so the loader
  // pauses whenever the section is scrolled away.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry?.isIntersecting ?? false;
        setInView(visible);
        if (visible) setRevealed(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const loaderRunning = inView && !hovered;

  useEffect(() => () => window.clearTimeout(swapTimer.current), []);

  function select(i: number) {
    if (i === target) return;
    setTarget(i);
    setFading(true);
    window.clearTimeout(swapTimer.current);
    swapTimer.current = window.setTimeout(() => {
      setShown(i);
      requestAnimationFrame(() => setFading(false));
    }, SWAP_MS);
  }

  function onTabKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const n = TESTIMONIALS.length;
    const next =
      e.key === "ArrowRight"
        ? (target + 1) % n
        : e.key === "ArrowLeft"
          ? (target - 1 + n) % n
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  }

  const t = TESTIMONIALS[shown];
  const count = TESTIMONIALS.length;

  return (
    <section
      ref={rootRef}
      aria-labelledby="testimonials-heading"
      className="relative bg-[#D9E8FE] py-20 sm:py-24 lg:py-28"
    >
      <h2 id="testimonials-heading" className="sr-only">
        {TESTIMONIALS_SECTION.heading}
      </h2>

      {/* hovering or focusing anywhere in the testimonial pauses the loader */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setHovered(false);
          }
        }}
        className="mx-auto flex max-w-[1320px] flex-col-reverse gap-12 px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-16"
      >
        {/* left — quote, CTAs, client tabs */}
        <div className="flex w-full flex-col lg:max-w-[640px]">
          <a
            href="/work"
            className="group inline-flex w-fit items-center gap-1 text-[13px] font-medium text-gn-black"
          >
            Client story
            <ChevronRight
              className="h-3.5 w-3.5 opacity-30 transition-[opacity,transform] duration-150 group-hover:translate-x-0.5 group-hover:opacity-60"
              aria-hidden
            />
          </a>

          <div
            id="testimonial-panel-v2"
            role="tabpanel"
            aria-labelledby={`testimonial-v2-tab-${target}`}
            aria-live="polite"
            className={`mt-6 min-h-[200px] transition-opacity duration-300 lg:min-h-[230px] ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          >
            <blockquote
              data-revealed={revealed}
              className="gn-v2-quote text-[30px] font-medium leading-[1.25] tracking-[-0.015em] text-gn-black sm:text-[36px] lg:text-[42px]"
            >
              <PullQuoteWords text={`“${t.highlight}”`} />
            </blockquote>
            <p
              data-revealed={revealed}
              className="gn-v2-rise gn-v2-rise-1 mt-5 text-[17px] text-gn-black/60 lg:text-[18px]"
            >
              {t.name} — {t.role}, {t.company}
            </p>
          </div>

          <div
            data-revealed={revealed}
            className="gn-v2-rise gn-v2-rise-2 mt-8 flex flex-wrap items-center gap-2"
          >
            <a
              href="/talk-to-an-expert"
              className="group inline-flex h-11 items-center gap-2 rounded-full bg-gn-black px-5 text-[15px] font-medium text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
            >
              Talk to an Expert
              <ArrowRight
                className="h-4 w-4 opacity-50 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-80"
                aria-hidden
              />
            </a>
            <a
              href="/work"
              className="inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium text-gn-black transition-colors duration-200 hover:bg-gn-black/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
            >
              All stories
            </a>
          </div>

          <div
            role="tablist"
            aria-label="Client testimonials"
            onKeyDown={onTabKeyDown}
            className="relative mt-12 flex border-t border-gn-blue/15 pt-4"
          >
            {/* active-tab slot, sitting on the tablist's own hairline (no
                extra track): the loader is a single black line that grows
                0 → 100% under the active company over AUTOPLAY_MS, pauses
                in place while hovered/off screen, and on finishing hands
                over to the next company. The slot jumps (no slide) and is
                keyed by tab, so each company's line starts from zero. */}
            <span
              aria-hidden
              className="absolute top-0 h-[2px] -translate-y-px overflow-hidden"
              style={{ left: `${(target * 100) / count}%`, width: `${100 / count}%` }}
            >
              <span
                key={target}
                className="gn-progress absolute inset-0 bg-gn-black"
                style={{
                  animationDuration: `${AUTOPLAY_MS}ms`,
                  animationPlayState: loaderRunning ? "running" : "paused",
                }}
                onAnimationEnd={() => select((target + 1) % count)}
              />
            </span>
            {TESTIMONIALS.map((item, i) => {
              const selected = i === target;
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  id={`testimonial-v2-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="testimonial-panel-v2"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={`flex flex-1 items-center justify-center py-3 text-[15px] font-semibold tracking-tight text-gn-black transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-gn-blue sm:text-[18px] ${
                    selected ? "opacity-100" : "opacity-40 hover:opacity-100"
                  }`}
                >
                  {item.company}
                </button>
              );
            })}
          </div>
        </div>

        {/* right — square duotone portrait */}
        <div
          data-revealed={revealed}
          className="gn-v2-image relative aspect-square w-full max-w-[480px] self-center overflow-hidden rounded-3xl lg:w-[45%]"
        >
          {TESTIMONIALS.map((item, i) => (
            <Image
              key={item.id}
              src={item.image}
              alt={i === shown ? `${item.name}, ${item.role} at ${item.company}` : ""}
              fill
              sizes="(min-width: 1024px) 480px, 100vw"
              // full colour; the slight overscale crops the sources'
              // baked-in rounded corners
              className={`scale-[1.04] object-cover object-top transition-opacity duration-300 ${
                i === shown && !fading ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Each word sits in its own mask so it can rise into view, as Steep does. */
function PullQuoteWords({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((word, i) => (
    <span key={i}>
      <span className="gn-v2-mask">
        <span
          className="gn-v2-word"
          style={{
            transitionDelay: `${Math.min(i * WORD_STAGGER_S, MAX_WORD_DELAY_S)}s`,
          }}
        >
          {word}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </span>
  ));
}
