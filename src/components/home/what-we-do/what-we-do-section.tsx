"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollRevealHeading } from "@/components/ui/scroll-reveal-heading";
import { SERVICES, WHAT_WE_DO, type Service } from "./content";

gsap.registerPlugin(ScrollTrigger);

const SLIDE_DURATION = 0.85;
const SLIDE_EASE = "power3.out";
const DRAG_THRESHOLD = 6;
const RUBBER_BAND = 0.35;
// How far (ms of release velocity) a flick carries before snapping.
const FLICK_MS = 220;
// Scroll-scrub smoothing (seconds the cards take to catch up with the page).
const SCRUB = 0.25;
// Extra scroll distance per card moved: >1 makes the cards travel slower than
// the page, which reads as a calmer, more premium slide.
const PIN_SCROLL_FACTOR = 1.35;
// Page scroll moves the cards this many card-widths, then releases the pin.
// Everything past that is reached with the arrows or by dragging.
const SCROLL_CARDS = 2.5;
// Share of the pinned scroll at each end where the cards rest, so the header
// can be read before they move and the last card settles before the unpin.
const HOLD = 0.08;
const SPAN = 1 - 2 * HOLD;

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

// Card height follows the viewport so the header, the whole card and its text
// always fit on one screen while the section is pinned.
const CARD_H = "clamp(320px, calc(100vh - 300px), 460px)";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/**
 * The track sits at `x = -(scroll + extra)`:
 *
 * - `scroll` is driven by the page scroll (pinned desktop mode only): the
 *   section sticks to the viewport while the cards move SCROLL_CARDS widths,
 *   then the pin releases and the page moves on.
 * - `extra` is driven by the arrows and by dragging / swiping, and is how the
 *   remaining cards are reached. On mobile / reduced motion there is no pin,
 *   `scroll` stays 0 and the carousel is arrows + swipe only.
 */
export function WhatWeDoSection() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  // Snap geometry, measured from the DOM so it follows any card / viewport size.
  const metrics = useRef({ step: 1, maxX: 0, stops: SERVICES.length });
  const offset = useRef({ scroll: 0, extra: 0 });
  const indexRef = useRef(0);
  const drag = useRef({
    active: false,
    moved: false,
    startX: 0,
    startExtra: 0,
    lastX: 0,
    lastT: 0,
    velocity: 0,
  });

  const [pinned, setPinned] = useState(false);
  const [index, setIndex] = useState(0);
  const [stops, setStops] = useState(SERVICES.length);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);
    const evaluate = () => setPinned(desktop.matches && !reduced.matches);
    evaluate();
    desktop.addEventListener("change", evaluate);
    reduced.addEventListener("change", evaluate);
    return () => {
      desktop.removeEventListener("change", evaluate);
      reduced.removeEventListener("change", evaluate);
    };
  }, []);

  const stopPosition = useCallback((i: number) => {
    const { step, maxX } = metrics.current;
    return Math.min(i * step, maxX);
  }, []);

  const nearestStop = useCallback(
    (pos: number) => {
      const { stops: count } = metrics.current;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < count; i++) {
        const dist = Math.abs(stopPosition(i) - pos);
        if (dist < bestDist) {
          best = i;
          bestDist = dist;
        }
      }
      return best;
    },
    [stopPosition],
  );

  // Single writer for the track's transform; also keeps `index` in step.
  const render = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const { maxX } = metrics.current;
    const raw = offset.current.scroll + offset.current.extra;

    // Rubber-band past either end (only reachable while dragging).
    let visual = raw;
    if (raw < 0) visual = raw * RUBBER_BAND;
    else if (raw > maxX) visual = maxX + (raw - maxX) * RUBBER_BAND;
    gsap.set(track, { x: -visual });

    const i = nearestStop(clamp(raw, 0, maxX));
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
    }
  }, [nearestStop]);

  const slideTo = useCallback(
    (i: number) => {
      const next = clamp(i, 0, metrics.current.stops - 1);
      gsap.to(offset.current, {
        extra: stopPosition(next) - offset.current.scroll,
        duration: prefersReducedMotion() ? 0 : SLIDE_DURATION,
        ease: SLIDE_EASE,
        overwrite: true,
        onUpdate: render,
        onComplete: render,
      });
    },
    [stopPosition, render],
  );

  // Measure on mount, on mode change and whenever the container or cards resize.
  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!view || !track || !wrap) return;
    const state = offset.current;

    const measure = () => {
      const first = track.children[0] as HTMLElement | undefined;
      const last = track.lastElementChild as HTMLElement | null;
      if (!first || !last) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      const step = first.offsetWidth + gap;
      const contentWidth = last.offsetLeft + last.offsetWidth;
      const maxX = Math.max(0, contentWidth - view.clientWidth);
      const count = maxX <= 0 ? 1 : Math.ceil(maxX / step - 0.01) + 1;

      metrics.current = { step, maxX, stops: count };
      setStops(count);

      if (pinned) {
        // One viewport of pin plus the scroll needed to move SCROLL_CARDS cards.
        const travel = Math.min(maxX, SCROLL_CARDS * step);
        wrap.style.height = `calc(100vh + ${(travel / SPAN) * PIN_SCROLL_FACTOR}px)`;
        ScrollTrigger.refresh();
      } else {
        wrap.style.height = "";
      }
      render();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    observer.observe(track.children[0]);
    return () => {
      observer.disconnect();
      gsap.killTweensOf(state);
      wrap.style.height = "";
    };
  }, [pinned, render]);

  // Pinned mode: page scroll drives `scroll`.
  useEffect(() => {
    if (!pinned) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const state = offset.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: SCRUB,
          invalidateOnRefresh: true,
          // Back above the section: forget any arrow / drag offset so the
          // carousel starts fresh next time it pins.
          onLeaveBack: () =>
            gsap.to(state, {
              extra: 0,
              duration: 0.6,
              ease: SLIDE_EASE,
              overwrite: true,
              onUpdate: render,
            }),
        },
      });
      // Rest at both ends; the tween owns the middle SPAN of the timeline.
      tl.fromTo(
        state,
        { scroll: 0 },
        {
          scroll: () =>
            Math.min(metrics.current.maxX, SCROLL_CARDS * metrics.current.step),
          ease: "power1.inOut",
          duration: SPAN,
          onUpdate: render,
        },
        HOLD,
      );
      tl.to({}, { duration: HOLD }, 1 - HOLD);
    }, wrap);

    return () => {
      ctx.revert();
      state.scroll = 0;
      render();
    };
  }, [pinned, render]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startExtra: offset.current.extra,
      lastX: e.clientX,
      lastT: e.timeStamp,
      velocity: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;

    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      d.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      gsap.killTweensOf(offset.current);
      d.startExtra = offset.current.extra;
      d.startX = e.clientX;
      return;
    }

    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.velocity = (e.clientX - d.lastX) / dt;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;

    // Dragging the cards left moves the track further along.
    offset.current.extra = d.startExtra - dx;
    render();
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    const { scroll, extra } = offset.current;
    const pos = clamp(scroll + extra, 0, metrics.current.maxX);
    slideTo(nearestStop(pos - d.velocity * FLICK_MS));
  };

  // A drag must not activate the link it started on.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Keyboard users tabbing to an off-screen card bring it into view.
  const onFocusCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-card]");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.left >= 8 && rect.right <= window.innerWidth - 8) return;
    slideTo(Number(card.dataset.index));
  };

  return (
    <section aria-labelledby="what-we-do-heading" className="relative bg-white">
      <div ref={wrapRef} className="relative">
        <div
          style={{ "--card-h": CARD_H } as React.CSSProperties}
          className={
            pinned
              ? "sticky top-0 flex h-screen flex-col justify-center overflow-x-clip pt-20 pb-6"
              : "overflow-x-clip py-24 sm:py-28"
          }
        >
          <div className="mx-auto w-full max-w-[1320px] px-6">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[820px]">
                <p className="flex items-center gap-2 text-[14px] font-semibold text-gn-blue">
                  <span aria-hidden className="flex flex-col gap-[3px]">
                    <span className="h-[3px] w-[3px] rounded-full bg-gn-blue" />
                    <span className="h-[3px] w-[3px] rounded-full bg-gn-blue" />
                    <span className="h-[3px] w-[3px] rounded-full bg-gn-blue" />
                  </span>
                  {WHAT_WE_DO.eyebrow}
                </p>
                <ScrollRevealHeading
                  id="what-we-do-heading"
                  className="mt-[clamp(8px,1.8vh,16px)] text-[30px] font-medium leading-[1.15] tracking-tight text-gn-black sm:text-[clamp(26px,4.6vh,38px)] lg:text-[clamp(26px,4.8vh,44px)]"
                >
                  {WHAT_WE_DO.title}
                </ScrollRevealHeading>
                <p className="mt-[clamp(8px,1.8vh,20px)] max-w-[640px] text-[clamp(13px,1.9vh,16px)] leading-[1.6] text-gn-dark-grey">
                  {WHAT_WE_DO.subtitle}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <ArrowButton
                  direction="prev"
                  disabled={index === 0}
                  onClick={() => slideTo(index - 1)}
                />
                <ArrowButton
                  direction="next"
                  disabled={index >= stops - 1}
                  onClick={() => slideTo(index + 1)}
                />
              </div>
            </div>
          </div>

          {/* Full-bleed drag surface; the track inside starts on the content grid. */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onClickCapture={onClickCapture}
            onFocusCapture={onFocusCapture}
            className="mt-[clamp(20px,4vh,48px)] cursor-grab touch-pan-y select-none active:cursor-grabbing"
          >
            <div ref={viewRef} className="mx-auto w-full max-w-[1320px] px-6">
              <ul
                ref={trackRef}
                role="group"
                aria-roledescription="carousel"
                aria-label="What we do"
                className="relative flex gap-6 will-change-transform"
              >
                {SERVICES.map((service, i) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    index={i}
                    total={SERVICES.length}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous service" : "Next service"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-gn-black/15 bg-white text-gn-black transition-[border-color,opacity,background-color] duration-300 hover:border-gn-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue disabled:cursor-default disabled:border-gn-black/10 disabled:text-gn-black/30 disabled:hover:border-gn-black/10"
    >
      <Icon className="h-5 w-5" aria-hidden />
    </button>
  );
}

function ServiceCard({
  service,
  index,
  total,
}: {
  service: Service;
  index: number;
  total: number;
}) {
  const mediaRef = useRef<HTMLDivElement>(null);

  // Mouse-only parallax: the image drifts a few px against the cursor.
  const onPointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    const media = mediaRef.current;
    if (!media || e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    media.style.setProperty("--px", `${(-nx * 14).toFixed(1)}px`);
    media.style.setProperty("--py", `${(-ny * 14).toFixed(1)}px`);
  };

  const onPointerLeave = () => {
    const media = mediaRef.current;
    if (!media) return;
    media.style.setProperty("--px", "0px");
    media.style.setProperty("--py", "0px");
  };

  return (
    <li
      data-card
      data-index={index}
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} of ${total}`}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="group @container relative h-(--card-h) w-[min(80vw,calc(var(--card-h)*0.92))] shrink-0 overflow-hidden rounded-xl bg-gn-black has-[a:focus-visible]:outline-2 has-[a:focus-visible]:-outline-offset-3 has-[a:focus-visible]:outline-gn-blue"
    >
      <div
        ref={mediaRef}
        className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:[transform:translate3d(var(--px,0px),var(--py,0px),0)_scale(1)] motion-safe:group-hover:[transform:translate3d(var(--px,0px),var(--py,0px),0)_scale(1.07)]"
      >
        <Image
          src={service.image}
          alt=""
          fill
          draggable={false}
          sizes="(min-width: 1024px) 420px, 80vw"
          className="object-cover"
        />
      </div>

      {/* brand tint so mixed placeholder photos read as one set */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gn-blue/15" />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(3,8,15,0.94)_0%,rgba(3,8,15,0.7)_32%,rgba(3,8,15,0.15)_62%,rgba(3,8,15,0)_78%)]"
      />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-start p-[clamp(16px,2.6vh,24px)]">
        <h3 className="whitespace-nowrap text-[clamp(15px,min(2.8vh,5.2cqw),21px)] font-semibold leading-[1.25] tracking-tight text-white">
          {service.title}
        </h3>
        <p className="mt-[clamp(6px,1vh,8px)] text-[clamp(12.5px,1.9vh,14px)] leading-[1.5] text-white/80">
          {service.description}
        </p>
        <a
          href={service.href}
          draggable={false}
          aria-label={`Explore ${service.title}`}
          className="group/cta mt-[clamp(10px,1.8vh,16px)] inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/20 px-4 py-[clamp(6px,1vh,8px)] text-[13px] font-medium text-white transition-colors duration-300 after:absolute after:inset-0 after:content-[''] hover:bg-white/30 focus-visible:outline-none"
        >
          Explore
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover/cta:translate-x-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>
      </div>
    </li>
  );
}
