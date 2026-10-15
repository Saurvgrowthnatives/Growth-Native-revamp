"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { ScrollRevealHeading } from "@/components/ui/scroll-reveal-heading";
import { AI_READINESS_SECTION, AUDIT_STEPS } from "./content";
import { AuditScene, ExecutionScene, OpportunityScene } from "./visuals";

// Superpower's own timings: 8s per card, a 750ms ease-in-out slide.
const DURATION_MS = 8000;
const TRANSITION_MS = 750;
const EASE = "cubic-bezier(0.45, 0, 0.55, 1)";
const SWIPE_RATIO = 0.15;

const N = AUDIT_STEPS.length;
// [clones | real | clones] — the track always rests on the middle copy, so
// it can run forever in either direction; after each move it re-snaps to
// the equivalent middle-copy slide without a transition.
const SLIDES = [...AUDIT_STEPS, ...AUDIT_STEPS, ...AUDIT_STEPS];
const SCENES = {
  audit: AuditScene,
  "opportunity-map": OpportunityScene,
  "execution-plan": ExecutionScene,
} as const;

const realIndexOf = (i: number) => ((i % N) + N) % N;

/**
 * Superpower "Changing outcomes" carousel (superpower.com), on the live
 * site's AI Readiness Audit content: one step in focus at a time, its
 * neighbours dimmed to half opacity either side. Each card's photo is
 * replaced by a motion scene that tells that step's story over the same
 * 8s the progress bar takes to fill, then the next card slides in.
 *
 * Progress: one bar per step; the active one widens and fills, and when it
 * finishes the carousel advances. It pauses while the section is off
 * screen, while the tab is hidden and while dragging — the scene pauses
 * with it, so the two never drift apart. Click a bar or a dimmed card,
 * drag/swipe, scroll horizontally or use the arrow keys to move.
 * Reduced motion: no autoplay, instant moves, scenes shown finished.
 */
export function AiReadinessSection() {
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentRef = useRef(N);
  const snapTimer = useRef<number | undefined>(undefined);
  const wheelLocked = useRef(false);
  const drag = useRef({ active: false, moved: false, startX: 0, startOffset: 0, width: 1 });

  const [current, setCurrent] = useState(N);
  const [animated, setAnimated] = useState(false);
  const [activation, setActivation] = useState(0);
  const [dir, setDir] = useState(1);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);

  const realIdx = realIndexOf(current);
  const running = inView && pageVisible && !dragging && !reduced;

  // Track offset that puts slide `idx` in the middle of the viewport, so the
  // active card always has one neighbour either side (3-up on desktop; on
  // narrower screens the neighbours simply peek in from the edges).
  const alignX = useCallback((idx: number) => {
    const slide = slideRefs.current[idx];
    const viewport = viewportRef.current;
    if (!slide || !viewport) return 0;
    return slide.offsetLeft + slide.offsetWidth / 2 - viewport.clientWidth / 2;
  }, []);

  const applyTransform = useCallback(
    (idx: number, withTransition: boolean) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transition = withTransition ? `transform ${TRANSITION_MS}ms ${EASE}` : "none";
      track.style.transform = `translate3d(${-alignX(idx)}px, 0, 0)`;
    },
    [alignX],
  );

  useLayoutEffect(() => {
    currentRef.current = current;
    applyTransform(current, animated && !reduced);
  }, [current, animated, reduced, applyTransform]);

  const go = useCallback((idx: number, direction: number) => {
    window.clearTimeout(snapTimer.current);
    currentRef.current = idx;
    setAnimated(true);
    setCurrent(idx);
    setDir(direction);
    setActivation((a) => a + 1);
    snapTimer.current = window.setTimeout(() => {
      let snapped = idx;
      while (snapped >= 2 * N) snapped -= N;
      while (snapped < N) snapped += N;
      if (snapped !== idx) {
        currentRef.current = snapped;
        setAnimated(false);
        setCurrent(snapped);
      }
    }, TRANSITION_MS + 50);
  }, []);

  const stepBy = useCallback(
    (delta: number) => go(currentRef.current + delta, delta),
    [go],
  );

  useEffect(() => () => window.clearTimeout(snapTimer.current), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => setReduced(query.matches);
    evaluate();
    query.addEventListener("change", evaluate);
    return () => query.removeEventListener("change", evaluate);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.3 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  // keep the active card aligned when the layout width changes
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => applyTransform(currentRef.current, false));
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [applyTransform]);

  // horizontal wheel / trackpad swipes step one card at a time
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onWheel = (e: WheelEvent) => {
      let dx = e.deltaX;
      if (e.shiftKey && Math.abs(e.deltaY) > Math.abs(e.deltaX)) dx = e.deltaY;
      if (Math.abs(dx) < Math.abs(e.deltaY) && !e.shiftKey) return;
      if (Math.abs(dx) < 10) return;
      e.preventDefault();
      if (wheelLocked.current) return;
      wheelLocked.current = true;
      stepBy(dx > 0 ? 1 : -1);
      window.setTimeout(() => {
        wheelLocked.current = false;
      }, TRANSITION_MS + 100);
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, [stepBy]);

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startOffset: alignX(currentRef.current),
      width: viewportRef.current?.clientWidth ?? 1,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      d.moved = true;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const track = trackRef.current;
    if (track) {
      track.style.transition = "none";
      track.style.transform = `translate3d(${-(d.startOffset - dx)}px, 0, 0)`;
    }
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (!d.moved) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > d.width * SWIPE_RATIO) {
      stepBy(dx < 0 ? 1 : -1);
    } else {
      applyTransform(currentRef.current, !reduced);
    }
    // the click that follows a drag must not count as a card click
    window.setTimeout(() => {
      d.moved = false;
    }, 0);
  }

  function onClickCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      stepBy(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepBy(-1);
    }
  }

  return (
    <section
      ref={rootRef}
      aria-labelledby="ai-readiness-heading"
      aria-roledescription="carousel"
      style={
        {
          // Vertical rhythm scales with the screen height, and the card
          // visual is capped so heading + cards + progress fit one screen
          // on desktop: --ar-vis-max is the height left after the fixed rows.
          "--ar-pad": "clamp(40px, 7vh, 128px)",
          "--ar-gap": "clamp(20px, 4vh, 64px)",
          "--ar-card-gap": "clamp(12px, 2.2vh, 28px)",
          "--ar-vis-max": "max(9.5rem, calc(78vh - 290px))",
        } as React.CSSProperties
      }
      className="relative overflow-x-clip bg-white py-[var(--ar-pad)]"
    >
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
          <div className="max-w-[39rem]">
            <p className="text-[14px] font-semibold text-gn-blue">
              {AI_READINESS_SECTION.eyebrow}
            </p>
            <ScrollRevealHeading
              id="ai-readiness-heading"
              accent={AI_READINESS_SECTION.highlightedHeading}
              accentClassName="text-gn-blue"
              className="mt-4 text-[32px] font-medium leading-[1.15] tracking-tight text-gn-black sm:text-[40px]"
            >
              {AI_READINESS_SECTION.heading}
            </ScrollRevealHeading>
            <p className="mt-3 text-base leading-7 text-gn-dark-grey sm:text-[17px] sm:leading-[1.65]">
              {AI_READINESS_SECTION.description}
            </p>
          </div>
          <a
            href={AI_READINESS_SECTION.cta.href}
            className="group inline-flex h-11 w-fit shrink-0 items-center gap-2 rounded-full bg-gn-black px-5 text-[15px] font-medium text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
          >
            {AI_READINESS_SECTION.cta.label}
            <ArrowRight
              className="h-4 w-4 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden
            />
          </a>
        </div>

        {/* the track starts on the content grid; neighbours spill past it */}
        <div
          ref={viewportRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          onClickCapture={onClickCapture}
          className="@container -mx-6 mt-[var(--ar-gap)] touch-pan-y select-none overflow-hidden"
        >
          <div ref={trackRef} className="flex w-max will-change-transform">
            {SLIDES.map((step, i) => {
              const isActive = realIndexOf(i) === realIdx;
              const isClone = i < N || i >= 2 * N;
              const Scene = SCENES[step.id];
              return (
                <div
                  key={`${step.id}-${i}`}
                  ref={(el) => {
                    slideRefs.current[i] = el;
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${step.number} of 0${N}: ${step.title}`}
                  aria-hidden={isClone || undefined}
                  onClick={() => {
                    if (i !== currentRef.current) go(i, i > currentRef.current ? 1 : -1);
                  }}
                  className={`relative shrink-0 transition-opacity duration-[600ms] ease-[ease] w-[88cqw] sm:w-[62cqw] lg:w-[calc(100cqw/3)] lg:after:absolute lg:after:inset-y-0 lg:after:-right-px lg:after:w-px lg:after:bg-gn-black/15 ${
                    isActive ? "opacity-100" : "cursor-pointer opacity-50"
                  }`}
                >
                  <article className="flex flex-col gap-[var(--ar-card-gap)] px-4 lg:px-6">
                    {/* the scene canvas is 5:3; on desktop its height is
                        also capped so the section fits the screen, and the
                        box narrows with it so the scene never letterboxes
                        and its captions stay the size they were drawn at */}
                    <div className="@container relative aspect-[5/3] w-full overflow-hidden rounded-xl bg-[#050b16] lg:max-w-[calc(var(--ar-vis-max)*1.6667)]">
                      {/* atmosphere: GN-blue glow + fine dot grid */}
                      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_0%,rgba(0,116,248,0.28),transparent_60%)]" />
                      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:22px_22px]" />
                      <div
                        className="gn-ar-viz absolute inset-0"
                        data-playing={isActive && !reduced}
                        data-paused={!running}
                      >
                        {/* remounted on every activation so the story
                            restarts in step with the progress bar */}
                        <Scene key={isActive ? `play-${activation}` : "rest"} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <p className="text-[15px] font-medium leading-[1.4] tracking-tight text-gn-black lg:text-[16px]">
                        <span className="text-gn-blue">{step.number}</span>
                        <span className="mx-2 text-gn-black/25">/</span>
                        {step.title}
                      </p>
                      <ul className="flex flex-col gap-1">
                        {step.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-center gap-2 text-[13px] leading-[1.5] text-gn-black/70 lg:text-[14px]"
                          >
                            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gn-blue" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>

        {/* progress — one bar per step; the active one widens and fills */}
        <div className="mt-[var(--ar-gap)] flex w-full max-w-[46rem] items-center gap-6" onKeyDown={onKeyDown}>
          <div className="flex min-w-0 flex-1 items-center gap-2">
            {AUDIT_STEPS.map((step, i) => {
              const selected = i === realIdx;
              return (
                <button
                  key={step.id}
                  type="button"
                  aria-label={`Show step ${step.number}: ${step.title}`}
                  aria-current={selected ? "step" : undefined}
                  onClick={() => {
                    if (i !== realIdx) go(N + i, i > realIdx ? 1 : -1);
                  }}
                  style={{
                    flexGrow: selected ? 8 : 1,
                    transition: `flex-grow ${TRANSITION_MS}ms ${EASE}`,
                  }}
                  className="group relative min-w-0 basis-0 py-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gn-blue"
                >
                  <span className="relative block h-1 overflow-hidden rounded-full bg-gn-black/20 transition-colors group-hover:bg-gn-black/30">
                    {selected ? (
                      <span
                        key={activation}
                        className="gn-progress absolute inset-0 rounded-full bg-gn-black"
                        style={{
                          animationDuration: `${DURATION_MS}ms`,
                          animationPlayState: running ? "running" : "paused",
                        }}
                        onAnimationEnd={() => stepBy(1)}
                      />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="shrink-0 overflow-hidden whitespace-nowrap text-[14px] text-gn-black/50" aria-live="off">
            <span
              key={activation}
              className={`inline-block ${activation === 0 ? "" : dir < 0 ? "gn-ar-count-prev" : "gn-ar-count-next"}`}
            >
              {realIdx + 1}
            </span>{" "}
            / {N}
          </p>
        </div>
      </div>
    </section>
  );
}
