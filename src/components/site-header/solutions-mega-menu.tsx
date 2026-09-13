"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { solutionsPillars } from "./nav-data";

export function SolutionsMegaMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function closeSoon() {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-1 px-1 py-2 text-[15px] font-medium text-white/65 transition-colors hover:text-white"
      >
        Solutions
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 w-[820px] max-w-[92vw] -translate-x-1/2 pt-3">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#070c14] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)]">
            <div className="grid grid-cols-4 gap-px bg-white/5">
              {solutionsPillars.map((pillar) => (
                <a
                  key={pillar.href}
                  href={pillar.href}
                  className="group flex flex-col gap-3 bg-[#070c14] p-5 transition-colors hover:bg-white/[0.03]"
                >
                  <span
                    aria-hidden
                    className="h-1 w-6 rounded-full"
                    style={{ background: "var(--gradient-gn-primary)" }}
                  />
                  <span className="text-sm font-semibold text-white">
                    {pillar.label}
                  </span>
                  <ul className="flex flex-col gap-1.5">
                    {pillar.capabilities.map((cap) => (
                      <li key={cap} className="text-xs leading-snug text-white/50">
                        {cap}
                      </li>
                    ))}
                  </ul>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
