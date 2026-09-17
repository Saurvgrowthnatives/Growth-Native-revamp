"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { AiDifferenceStatic } from "./ai-difference-static";

const AiDifferenceInteractive = dynamic(
  () => import("./ai-difference-interactive").then((m) => m.AiDifferenceInteractive),
  { ssr: false }
);

const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function AiDifferenceSection() {
  // `null` until measured, so the pinned track never mounts on a guess.
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
    <section id="ai-difference" className="relative bg-white">
      {immersive ? <AiDifferenceInteractive /> : <AiDifferenceStatic />}
    </section>
  );
}
