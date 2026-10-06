"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Eases wheel / trackpad scrolling and feeds every scroll update to
 * ScrollTrigger, so the scrubbed sections (Why Partner, AI Difference, the
 * What We Do card slide, heading reveals) glide instead of stepping.
 *
 * Lenis smooths the *native* scroll position rather than transforming the
 * page, so the CSS-sticky pinned sections keep working (GSAP's ScrollSmoother
 * would break them). Touch scrolling stays native, and users who ask for
 * reduced motion get no smoothing at all. Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      // Frame-rate-independent easing toward the target: each frame closes
      // this fraction of the remaining distance (Lenis' default is 0.1).
      lerp: 0.085,
      // A touch under 1 so a wheel notch travels a little less — calmer feel.
      wheelMultiplier: 0.9,
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    // Keep scrubbed animations in step with the scroll after a long frame.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
