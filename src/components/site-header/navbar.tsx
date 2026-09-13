"use client";

import { ArrowRight, Menu } from "lucide-react";
import { Logo } from "./logo";
import { SolutionsMegaMenu } from "./solutions-mega-menu";
import { navItems, primaryCta } from "./nav-data";
import { AnimatedBorderButton } from "@/components/ui/animated-border-button";

export function Navbar({ onOpenMobileMenu }: { onOpenMobileMenu: () => void }) {
  return (
    <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-4 sm:px-6 lg:px-10">
      <Logo />

      <nav className="hidden items-center gap-7 lg:flex">
        {navItems.map((item) =>
          item.megaMenu ? (
            <SolutionsMegaMenu key={item.label} />
          ) : (
            <a
              key={item.label}
              href={item.href}
              className="px-1 py-2 text-[15px] font-medium text-white/65 transition-colors hover:text-white"
            >
              {item.label}
            </a>
          )
        )}
      </nav>

      <div className="flex items-center gap-3">
        <AnimatedBorderButton
          href={primaryCta.href}
          className="hidden lg:inline-flex"
        >
          {primaryCta.label}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </AnimatedBorderButton>

        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-full p-2 text-white hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </div>
  );
}
