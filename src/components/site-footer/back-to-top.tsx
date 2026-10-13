"use client";

import { ArrowUp } from "lucide-react";

export function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-gn-blue text-white transition-colors duration-200 hover:bg-[#005fd0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <ArrowUp className="h-4 w-4" aria-hidden />
    </button>
  );
}
