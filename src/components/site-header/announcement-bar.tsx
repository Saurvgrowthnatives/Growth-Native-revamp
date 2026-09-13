"use client";

import { ArrowRight, X } from "lucide-react";

type AnnouncementBarProps = {
  onClose: () => void;
};

export function AnnouncementBar({ onClose }: AnnouncementBarProps) {
  return (
    <div className="relative bg-gn-blue text-white">
      <div className="mx-auto flex h-10 max-w-[1440px] items-center justify-center gap-3 px-4 text-sm">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium tracking-wide">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--gradient-gn-primary)" }}
          />
          New
        </span>

        <span className="hidden truncate sm:inline">
          Growth Natives Reimagined — Explore the AI-native platform
        </span>
        <span className="truncate sm:hidden">Growth Natives Reimagined</span>

        <a
          href="/about"
          className="inline-flex shrink-0 items-center gap-1 font-medium text-white underline-offset-4 hover:underline"
        >
          Learn More
          <ArrowRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>

      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}
