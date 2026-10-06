"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollRevealHeading } from "@/components/ui/scroll-reveal-heading";
import { AI_FEATURES } from "./content";
import { FEATURE_ICONS } from "./icons";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_VH_PER_ITEM = 40;
// Exactly three rows are ever visible: the active title and one neighbour
// above and below it. Anything further is opacity 0 (present in the track
// for a continuous slide, but never shown or reachable by keyboard). All
// three share one font size/weight — only opacity marks which is active, so
// the row transition never triggers a layout-affecting font-size animation.
const NEIGHBOR_OPACITY = 0.2;
// Extra room above/below the exact prev-to-next span, purely so the mask's
// fade has something to fade through rather than starting flush on the text.
const FADE_MARGIN = 24;

// Dial: one ring of ticks, split into an equal segment per feature, so the
// lit arc doubles as a "3 of 9" progress read-out.
const TICKS_PER_FEATURE = 8;
const TICK_COUNT = AI_FEATURES.length * TICKS_PER_FEATURE;
const TICK_INNER = 80;
const TICK_OUTER = 91;

const DIAL_TICKS = Array.from({ length: TICK_COUNT }, (_, i) => {
  const angle = (i / TICK_COUNT) * Math.PI * 2 - Math.PI / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x1: 100 + cos * TICK_INNER,
    y1: 100 + sin * TICK_INNER,
    x2: 100 + cos * TICK_OUTER,
    y2: 100 + sin * TICK_OUTER,
  };
});

/**
 * Pinned "why" track (unitedcarriers.com/careers reference): a static dial on
 * the left whose icon swaps as the active feature changes, the feature titles
 * running through the middle, and the active description held on the right.
 *
 * `activeIndex` is the single source of truth — scroll position sets it, and
 * clicking a title drives the page scroll so the same rule resolves to the
 * clicked item; the two can never disagree. The track's transform is derived
 * from the active row's *measured* offsetTop/offsetHeight, so a title that
 * wraps to two lines stays exactly centred.
 */
export function AiDifferenceInteractive() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const listWrapRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  function centerActiveItem() {
    const wrap = listWrapRef.current;
    const list = listRef.current;
    const i = activeIndexRef.current;
    const activeEl = itemRefs.current[i];
    if (!wrap || !list || !activeEl) return;

    // A title can wrap to two lines (e.g. "Targeting Your Ideal Customer
    // Profiles"), so rows are not a fixed height — the wrap must size itself
    // to whatever the active row plus its two neighbours actually measure,
    // every time, or a two-line neighbour gets clipped by a fixed box.
    const prevEl = itemRefs.current[i - 1] ?? activeEl;
    const nextEl = itemRefs.current[i + 1] ?? activeEl;
    const topEdge = prevEl.offsetTop;
    const bottomEdge = nextEl.offsetTop + nextEl.offsetHeight;
    wrap.style.height = `${bottomEdge - topEdge + FADE_MARGIN * 2}px`;

    const centerY = wrap.clientHeight / 2;
    const y = centerY - activeEl.offsetTop - activeEl.offsetHeight / 2;
    list.style.transform = `translate3d(0, ${y}px, 0)`;
  }

  useLayoutEffect(() => {
    centerActiveItem();
  }, [activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    const listWrap = listWrapRef.current;
    if (!section || !listWrap) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Each feature owns an equal 1/N band of the scroll range, so the
        // first and last get the same dwell as the middle ones.
        const n = AI_FEATURES.length;
        const idx = Math.min(n - 1, Math.max(0, Math.floor(self.progress * n)));
        if (idx !== activeIndexRef.current) {
          activeIndexRef.current = idx;
          setActiveIndex(idx);
        }
      },
    });

    const ro = new ResizeObserver(centerActiveItem);
    ro.observe(listWrap);

    return () => {
      ro.disconnect();
      st.kill();
    };
  }, []);

  function goTo(i: number) {
    const section = sectionRef.current;
    if (!section) return;
    const st = ScrollTrigger.getAll().find((s) => s.trigger === section);
    if (!st) return;
    // Aim at the middle of item i's band, so once the scroll lands the
    // onUpdate rule above resolves to exactly i.
    const targetProgress = (i + 0.5) / AI_FEATURES.length;
    window.scrollTo({
      top: st.start + targetProgress * (st.end - st.start),
      behavior: "smooth",
    });
  }

  const activeFeature = AI_FEATURES[activeIndex];
  const ActiveIcon = FEATURE_ICONS[activeIndex];
  const litTicks = (activeIndex + 1) * TICKS_PER_FEATURE;

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${AI_FEATURES.length * SCROLL_VH_PER_ITEM}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden bg-gn-black">
        {/* blue atmosphere behind the dial, per the brand's dark surfaces */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 h-[720px] w-[720px] -translate-x-1/3 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,116,248,0.12),transparent_65%)]"
        />

        <div className="relative mx-auto grid w-full max-w-[1320px] grid-cols-[300px_1fr] items-center gap-12 px-6 lg:px-12 xl:grid-cols-[300px_1fr_300px] xl:gap-16">
          {/* left — intro + the static dial */}
          <div className="flex flex-col">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gn-blue">
              Our AI Difference
            </p>
            <ScrollRevealHeading
              start="top 100%"
              end="top 55%"
              className="mt-3 max-w-[260px] text-[20px] font-medium leading-[1.35] tracking-tight text-white"
            >
              The AI Engine Behind Everything We Do
            </ScrollRevealHeading>

            <div
              className="relative mt-10 h-[200px] w-[200px]"
              role="img"
              aria-label={`Feature ${activeIndex + 1} of ${AI_FEATURES.length}`}
            >
              <svg viewBox="0 0 200 200" className="h-full w-full">
                <circle
                  cx="100"
                  cy="100"
                  r="62"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="1"
                />
                {DIAL_TICKS.map((tick, i) => (
                  <line
                    key={i}
                    x1={tick.x1}
                    y1={tick.y1}
                    x2={tick.x2}
                    y2={tick.y2}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    className="gn-dial-tick"
                    stroke={
                      i < litTicks ? "#0074F8" : "rgba(255,255,255,0.14)"
                    }
                  />
                ))}
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <ActiveIcon
                  key={activeFeature.id}
                  className="gn-swap-in h-9 w-9 text-white"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>
            </div>

            <a
              href="/ai-labs"
              className="mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Explore More
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </div>

          {/* centre — exactly 3 rows: active, centred, plus one neighbour
              above and below. Rows beyond that stay in the track (for a
              continuous slide) but sit at opacity 0 and out of tab order. */}
          <div
            ref={listWrapRef}
            className="gn-feature-mask relative overflow-hidden"
          >
            <div
              ref={listRef}
              className="gn-feature-track absolute left-0 top-0 flex w-full flex-col gap-8 sm:gap-12 xl:gap-14"
            >
              {AI_FEATURES.map((feature, i) => {
                const dist = Math.abs(i - activeIndex);
                const isActive = dist === 0;
                const isVisible = dist <= 1;
                return (
                  <div
                    key={feature.id}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isActive ? "true" : undefined}
                      aria-hidden={!isVisible}
                      tabIndex={isVisible ? 0 : -1}
                      className="gn-feature-title block max-w-[520px] text-left text-[26px] font-bold leading-[1.18] tracking-tight text-white xl:text-[32px]"
                      style={{
                        opacity: isActive ? 1 : isVisible ? NEIGHBOR_OPACITY : 0,
                        pointerEvents: isVisible ? "auto" : "none",
                      }}
                    >
                      {feature.title}
                      {/* every description stays readable to screen readers,
                          whatever the visible right-hand column shows */}
                      <span className="sr-only">. {feature.description}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* right — the active description, held level with the centred row */}
          <div className="hidden xl:block" aria-hidden>
            <p
              key={activeFeature.id}
              className="gn-swap-in max-w-[280px] text-[17px] leading-[1.75] text-white/55"
            >
              {activeFeature.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
