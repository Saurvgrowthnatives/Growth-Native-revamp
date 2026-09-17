"use client";

import { useEffect, useRef } from "react";
import { METRICS, WHY_PARTNER } from "./content";
import {
  createWhyPartnerScene,
  type LabelProjection,
  type WhyPartnerScene,
} from "./growth-stack-scene";
import { WhyPartnerStatic } from "./why-partner-static";

/** Right-side panel labels, in the exact order the scene projects them:
 *  200+ (top wall), 94% (bottom wall), 3x, 15+. The GN core panel carries no
 *  text — it's a pure visual, built entirely in Three.js.
 *  `maxWidth` here is only the pre-first-frame fallback (avoids a layout
 *  flash before the scene's first tick runs) — every frame after that,
 *  writeLabels() overrides the width with the panel's live projected size. */
const PANEL_LABELS = [
  { metric: METRICS[0], maxWidth: 620, narrow: false },
  { metric: METRICS[1], maxWidth: 620, narrow: false },
  { metric: METRICS[2], maxWidth: 380, narrow: true },
  { metric: METRICS[3], maxWidth: 380, narrow: true },
];

export function WhyPartnerDesktop() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const fallbackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = canvasWrapRef.current;
    const section = sectionRef.current;
    if (!canvas || !wrap || !section) return;

    function writeLabels(projections: LabelProjection[]) {
      for (let i = 0; i < projections.length; i++) {
        const el = labelRefs.current[i];
        if (!el) continue;
        const pr = projections[i];
        el.style.opacity = String(pr.opacity);
        el.style.transform = `translate3d(${pr.x}px, ${pr.y}px, 0) rotate(${pr.rotation}deg) scale(${pr.scale})`;
        // Cap the label to the panel's actual live on-screen size so text
        // always wraps inside the box, at any viewport size or zoom level;
        // maxHeight + overflow-hidden (on the element's class) is the hard
        // backstop that guarantees it never spills into the box below even
        // if the static type sizing above turns out to be too tight.
        el.style.width = `${pr.maxWidth}px`;
        el.style.maxHeight = `${pr.maxHeight}px`;
      }
    }

    const rect = wrap.getBoundingClientRect();
    const scene = createWhyPartnerScene({
      canvas,
      section,
      width: Math.max(rect.width, 1),
      height: Math.max(rect.height, 1),
      allowParallax: !window.matchMedia("(hover: none)").matches,
      onFrame: writeLabels,
    });

    // WebGL unavailable — reveal the static architecture instead of an empty canvas.
    if (!scene) {
      if (fallbackRef.current) fallbackRef.current.hidden = false;
      if (stageRef.current) stageRef.current.hidden = true;
      section.style.height = "auto";
      return;
    }

    const activeScene: WhyPartnerScene = scene;

    // pause rendering (not the scroll timeline — GSAP/ScrollTrigger keep the
    // scrubbed progress correct regardless) when far off-screen
    const io = new IntersectionObserver(
      (entries) => activeScene.setActive(!!entries[0]?.isIntersecting),
      { rootMargin: "20% 0px" }
    );
    io.observe(section);

    const ro = new ResizeObserver(() => {
      const r = wrap.getBoundingClientRect();
      activeScene.resize(Math.max(r.width, 1), Math.max(r.height, 1));
    });
    ro.observe(wrap);

    return () => {
      io.disconnect();
      ro.disconnect();
      activeScene.dispose();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative" style={{ height: "320vh" }}>
      {/* Screen-reader representation — the canvas is never the only source of copy */}
      <div className="sr-only">
        <h2>{WHY_PARTNER.heading}</h2>
        <p>{WHY_PARTNER.description}</p>
        <dl>
          {METRICS.map((m) => (
            <div key={m.id}>
              <dt>
                {m.value} — {m.label}
              </dt>
              <dd>{m.description}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div ref={fallbackRef} hidden>
        <WhyPartnerStatic />
      </div>

      <div
        ref={stageRef}
        className="sticky top-0 h-screen overflow-hidden"
        aria-hidden
      >
        {/* pt offsets the sticky site header so the composition stays centred
            in the area the visitor can actually see */}
        <div className="mx-auto flex h-full max-w-[1440px] items-stretch px-8 pb-10 pt-[112px] lg:px-12">
          {/* ---------------------------------------------- left narrative --
              Static for the entire pinned sequence. Only the section's own
              scroll-into-view fade (gn-fade-up, on the outer wrapper) touches
              it — nothing here changes while the right side animates. */}
          <div className="gn-fade-up relative flex w-[36%] shrink-0 flex-col justify-center">
            <p className="flex items-center gap-3 text-[11px] font-semibold tracking-[0.18em] text-gn-blue">
              <span className="h-px w-7 bg-gn-blue/40" aria-hidden />
              {WHY_PARTNER.eyebrow.toUpperCase()}
            </p>
            <h2 className="mt-8 max-w-[460px] text-[40px] font-medium leading-[1.12] tracking-tight text-gn-black">
              {WHY_PARTNER.heading}
            </h2>
            <p className="mt-6 max-w-[420px] text-[15px] leading-7 text-gn-dark-grey">
              {WHY_PARTNER.description}
            </p>
          </div>

          {/* ------------------------------------------- right WebGL system */}
          <div ref={canvasWrapRef} className="relative w-[64%] grow">
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

            {/* crisp DOM typography anchored to the 3D layers */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {PANEL_LABELS.map(({ metric, maxWidth, narrow }, i) => (
                <div
                  key={metric.id}
                  ref={(el) => {
                    labelRefs.current[i] = el;
                  }}
                  // overflow-hidden here is a hard backstop, not the primary
                  // fix — writeLabels() sizes width/height from the panel's
                  // own live projection every frame, so this should rarely if
                  // ever actually clip anything; it just guarantees text can
                  // never visibly spill past its own box.
                  className="absolute left-0 top-0 origin-top-left overflow-hidden opacity-0 will-change-transform"
                  style={{ width: maxWidth }}
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span
                      className={`shrink-0 font-medium leading-none tracking-tight text-gn-black ${narrow ? "text-[26px]" : "text-[31px]"}`}
                    >
                      {metric.value}
                    </span>
                    <span
                      className={`break-words font-semibold text-gn-black/75 ${narrow ? "text-[13px] leading-[1.3]" : "text-[15px] leading-[1.35]"}`}
                    >
                      {metric.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
