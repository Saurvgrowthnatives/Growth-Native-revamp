"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { STATS } from "./content";

// three.js only loads on the client, after the stats themselves render
const GrowthBurst = dynamic(
  () => import("./growth-burst").then((m) => m.GrowthBurst),
  { ssr: false },
);

const EASE = "cubic-bezier(0.25, 1, 0.5, 1)";

/**
 * Stripe "backbone of global commerce" stats (stripe.com), on plain white:
 * a row of figures where the active one is solid and the rest are quiet.
 * Hovering a figure makes it active, and a short blue gradient line above
 * and below slides across to sit over it. Below, the growth burst reacts
 * to the pointer and pulses whenever the active figure changes.
 *
 * On phones the stats stack and all read at full strength (no hover there).
 */
export function StatsSection() {
  const [active, setActive] = useState(0);
  const count = STATS.length;
  const indicator = {
    left: `${(active * 100) / count}%`,
    width: `${100 / count}%`,
    transition: `left 0.4s cubic-bezier(0.4, 0, 0.2, 1)`,
  };

  return (
    <section aria-label="Growth Natives in numbers" className="relative bg-white">
      <div className="mx-auto max-w-[1320px] px-6">
        <div>
          {/* stats row */}
          <div className="relative">
            <span
              aria-hidden
              className="pointer-events-none absolute -top-px hidden h-px bg-[linear-gradient(90deg,transparent_0%,#0074F8_50%,transparent_100%)] sm:block"
              style={indicator}
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-px hidden h-px bg-[linear-gradient(90deg,transparent_0%,#0074F8_50%,transparent_100%)] sm:block"
              style={indicator}
            />

            <ul className="grid sm:grid-cols-3">
              {STATS.map((stat, i) => {
                const isActive = i === active;
                return (
                  <li
                    key={stat.id}
                    onMouseEnter={() => setActive(i)}
                    className="group flex flex-col items-center gap-2 px-6 py-10 text-center sm:cursor-default sm:py-12 lg:py-14"
                  >
                    <p
                      className={`text-[40px] font-normal leading-none tracking-tight lg:text-[52px] max-sm:text-gn-black ${
                        isActive ? "text-gn-black" : "text-gn-dark-grey/45 group-hover:text-gn-dark-grey/70"
                      }`}
                      style={{ transition: `color 0.3s ${EASE}` }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`max-w-[220px] text-balance text-[15px] leading-[1.45] max-sm:text-gn-dark-grey ${
                        isActive ? "text-gn-black/80" : "text-gn-dark-grey/45 group-hover:text-gn-dark-grey/70"
                      }`}
                      style={{ transition: `color 0.3s ${EASE}` }}
                    >
                      {stat.label}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* growth burst */}
          <div className="relative mt-7 h-[280px] overflow-hidden sm:mt-11 sm:h-[360px] lg:mt-19 lg:h-[440px]">
            <GrowthBurst pulseKey={active} />
          </div>
        </div>
      </div>
    </section>
  );
}
