"use client";

import { useState } from "react";
import { ArrowRight, ChevronDown, X } from "lucide-react";
import { navItems, primaryCta, solutionsPillars } from "./nav-data";
import { AnimatedBorderButton } from "@/components/ui/animated-border-button";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [openPillar, setOpenPillar] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 bg-gn-black lg:hidden">
      <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
        <span className="text-[17px] font-semibold text-white">Menu</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-full p-2 text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <nav className="flex flex-col gap-1 overflow-y-auto px-4 py-4">
        {navItems.map((item) => {
          if (item.megaMenu) {
            const isOpen = openLabel === item.label;
            return (
              <div key={item.label} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setOpenLabel(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-3 text-base font-medium text-white"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {isOpen && (
                  <div className="flex flex-col gap-1 pb-3 pl-2">
                    {solutionsPillars.map((pillar) => {
                      const pillarOpen = openPillar === pillar.label;
                      return (
                        <div key={pillar.label}>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenPillar(pillarOpen ? null : pillar.label)
                            }
                            aria-expanded={pillarOpen}
                            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-medium text-white"
                          >
                            {pillar.label}
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                pillarOpen ? "rotate-180" : ""
                              }`}
                              aria-hidden
                            />
                          </button>
                          {pillarOpen && (
                            <ul className="flex flex-col gap-1 py-1 pl-4">
                              {pillar.capabilities.map((cap) => (
                                <li
                                  key={cap}
                                  className="py-1 text-sm text-white/55"
                                >
                                  {cap}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg border-b border-white/10 px-2 py-3 text-base font-medium text-white last:border-none"
            >
              {item.label}
            </a>
          );
        })}

        <AnimatedBorderButton href={primaryCta.href} className="mt-4 w-full">
          <span className="w-full text-center">{primaryCta.label}</span>
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </AnimatedBorderButton>
      </nav>
    </div>
  );
}
