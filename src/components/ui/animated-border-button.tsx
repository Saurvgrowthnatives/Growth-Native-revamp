import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBorderButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function AnimatedBorderButton({
  href,
  children,
  className,
}: AnimatedBorderButtonProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full p-[1.5px]",
        className
      )}
    >
      {/* Rotating brand-colored sweep, masked down to a thin ring by the inset fill below */}
      <span
        aria-hidden
        className="gn-border-spin absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from var(--gn-angle), transparent 0%, #0074F8 12%, #19C027 24%, transparent 40%)",
        }}
      />

      {/* Static subtle ring — always visible regardless of sweep position */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-full border border-white/15"
      />

      {/* Fill + content */}
      <span className="relative flex w-full items-center justify-center gap-2 rounded-full bg-gn-black px-5 py-2.5 text-[15px] font-semibold text-white transition-colors group-hover:bg-[#0a0f18]">
        {children}
      </span>
    </a>
  );
}
