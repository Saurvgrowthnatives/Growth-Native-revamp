"use client";

import { useState } from "react";
import { TestimonialsV1 } from "./testimonials-v1";
import { TestimonialsV2 } from "./testimonials-v2";

type Variant = "v1" | "v2";

const VARIANTS: { id: Variant; label: string }[] = [
  { id: "v1", label: "Version 1" },
  { id: "v2", label: "Version 2" },
];

/**
 * Two layouts of the same testimonials, switchable in place for review:
 * Version 1 (Supercut, dark) and Version 2 (Steep, pale blue). The switch
 * floats in the section's top padding and restyles itself for whichever
 * surface it sits on.
 */
export function TestimonialsSection() {
  const [variant, setVariant] = useState<Variant>("v1");
  const onDark = variant === "v1";

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-5 z-20">
        <div className="mx-auto flex max-w-[1320px] justify-end px-6">
          <div
            role="group"
            aria-label="Testimonial layout"
            className={`pointer-events-auto inline-flex rounded-full border p-1 text-[12px] font-medium ${
              onDark ? "border-white/15 bg-white/5" : "border-gn-black/10 bg-white/60"
            }`}
          >
            {VARIANTS.map((v) => {
              const selected = v.id === variant;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setVariant(v.id)}
                  className={`rounded-full px-3 py-1.5 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-gn-blue ${
                    selected
                      ? onDark
                        ? "bg-white text-gn-black"
                        : "bg-gn-black text-white"
                      : onDark
                        ? "text-white/70 hover:text-white"
                        : "text-gn-black/60 hover:text-gn-black"
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {variant === "v1" ? <TestimonialsV1 /> : <TestimonialsV2 />}
    </div>
  );
}
