"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { WhyPartnerStatic } from "./why-partner-static";

// WebGL stays out of the server bundle and off small screens entirely.
const WhyPartnerDesktop = dynamic(
  () => import("./why-partner-desktop").then((m) => m.WhyPartnerDesktop),
  { ssr: false }
);

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function WhyPartnerSection() {
  // `null` until measured, so the scroll experience never mounts on a guess.
  const [immersive, setImmersive] = useState<boolean | null>(null);

  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const reduced = window.matchMedia(REDUCED_QUERY);

    const evaluate = () => setImmersive(desktop.matches && !reduced.matches);
    evaluate();

    desktop.addEventListener("change", evaluate);
    reduced.addEventListener("change", evaluate);
    return () => {
      desktop.removeEventListener("change", evaluate);
      reduced.removeEventListener("change", evaluate);
    };
  }, []);

  return (
    <section
      id="why-growth-natives"
      className="relative"
      style={{ backgroundColor: "#F5F6F3" }}
    >
      {immersive ? <WhyPartnerDesktop /> : <WhyPartnerStatic />}
    </section>
  );
}
