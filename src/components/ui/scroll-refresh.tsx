"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Re-measures every ScrollTrigger when the page's total height changes after
 * load. Several sections mount late (dynamic imports, matchMedia gates) and
 * grow or shrink the page, which would otherwise leave the triggers below
 * them positioned against the old layout. Renders nothing.
 */
export function ScrollRefresh() {
  useEffect(() => {
    const root = document.documentElement;
    let lastHeight = root.scrollHeight;
    let timer: ReturnType<typeof setTimeout>;

    const observer = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (Math.abs(root.scrollHeight - lastHeight) < 2) return;
        ScrollTrigger.refresh();
        // Pin spacers can change the height during a refresh; record the
        // settled value so that change doesn't trigger another refresh.
        lastHeight = root.scrollHeight;
      }, 200);
    });
    observer.observe(document.body);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return null;
}
