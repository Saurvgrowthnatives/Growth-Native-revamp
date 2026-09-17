"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AI_FEATURES } from "./content";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_VH_PER_ITEM = 45;
// Opacity by distance from the active row (0/1/2/3+), taken directly from
// the approved Figma spec (0.15 / 0.35 / 0.6 / 1), not guessed.
const OPACITY_BY_DIST = [1, 0.6, 0.35, 0.15];

// Dummy per-feature photo until real imagery exists — Lorem Picsum, seeded
// per feature id so each service gets a stable, distinct placeholder image
// (not a random one on every reload) rather than an icon-in-a-box.
function placeholderImageUrl(featureId: string) {
  return `https://picsum.photos/seed/${featureId}/480/365`;
}

/**
 * `activeIndex` is the single source of truth: scroll position decides it,
 * and a click drives the page scroll so the same rule produces the index
 * that was clicked — the two can never disagree.
 *
 * The active row's description lives in normal document flow directly under
 * its title (matching the approved Figma layout), which means the active
 * row is taller than an inactive one and later rows shift down — so instead
 * of a fixed row-height formula, the track's transform is derived from the
 * active item's *measured* offsetTop/offsetHeight every time activeIndex
 * changes. That's what keeps the active row exactly centred regardless of
 * whether its description wraps to one line or three.
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
    const activeEl = itemRefs.current[activeIndexRef.current];
    if (!wrap || !list || !activeEl) return;
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
    const targetY = st.start + targetProgress * (st.end - st.start);
    window.scrollTo({ top: targetY, behavior: "smooth" });
  }

  const activeFeature = AI_FEATURES[activeIndex];

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{ height: `${AI_FEATURES.length * SCROLL_VH_PER_ITEM}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center bg-white">
        <div className="mx-auto grid w-full max-w-[1320px] grid-cols-[230px_1fr_240px] items-center gap-12 px-6 lg:gap-16 lg:px-12">
          {/* left intro — fixed, never moves with the track */}
          <div>
            <p className="text-[15px] text-gn-blue">Our AI Difference</p>
            <p className="mt-2 max-w-[230px] text-[20px] leading-[1.4] text-gn-black/80">
              The AI Engine Behind Everything We Do
            </p>
            <a
              href="/ai-labs"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-black/[0.12] px-6 py-3.5 text-[15px] font-medium text-gn-black transition-colors hover:bg-black/[0.03]"
            >
              Explore More
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </a>
          </div>

          {/* centre — the scrolling track */}
          <div ref={listWrapRef} className="gn-feature-mask relative h-[480px] overflow-hidden">
            <div ref={listRef} className="gn-feature-track absolute left-0 top-0 flex w-full flex-col gap-[17px]">
              {AI_FEATURES.map((feature, i) => {
                const isActive = i === activeIndex;
                const dist = Math.min(3, Math.abs(i - activeIndex));
                return (
                  <div
                    key={feature.id}
                    ref={(el) => {
                      itemRefs.current[i] = el;
                    }}
                    className="flex flex-col gap-[11px]"
                  >
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isActive ? "true" : undefined}
                      className="gn-feature-title flex w-full items-center gap-3 truncate text-left text-[24px] leading-[1.2] tracking-tight xl:text-[28px]"
                      style={{
                        color: isActive ? "#0074F8" : "#1c1c1e",
                        fontWeight: isActive ? 500 : 400,
                        opacity: isActive ? 1 : OPACITY_BY_DIST[dist],
                      }}
                    >
                      {feature.title}
                      {isActive && (
                        <ArrowUpRight className="h-6 w-6 shrink-0 text-gn-green" aria-hidden />
                      )}
                    </button>
                    {isActive && (
                      <p
                        className="max-w-[500px] text-[17px] leading-[1.4]"
                        style={{ color: "rgb(126, 129, 134)" }}
                      >
                        {feature.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* right — dummy per-feature photo (not real imagery yet),
              crossfades in as the active feature changes */}
          <div className="hidden xl:flex xl:justify-center">
            <div
              key={activeFeature.id}
              className="gn-feature-icon relative aspect-[241/183] w-[220px] overflow-hidden rounded-2xl"
              style={{ transform: "rotate(5deg)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external placeholder-only source, not app content */}
              <img
                src={placeholderImageUrl(activeFeature.id)}
                alt=""
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gn-blue/15" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
