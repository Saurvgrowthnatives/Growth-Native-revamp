"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealHeadingProps = {
  children: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** ScrollTrigger start: heading top meets this line of the viewport. */
  start?: string;
  /** ScrollTrigger end: every word is fully sharp once this line is reached. */
  end?: string;
};

// Seconds the words take to catch up with the scroll position; higher = softer.
const SCRUB = 1.2;
// Seconds of timeline between one word starting and the next, and how long a
// single word takes to resolve. Timeline length is scrubbed, so these only set
// the *relative* overlap between words.
const WORD_STAGGER = 0.1;
const WORD_DURATION = 0.9;

/**
 * Word-by-word scroll reveal for major section headings: each word goes from
 * blurred / faint / slightly low to sharp / solid / in place, left to right,
 * scrubbed by scroll position (so it reverses smoothly on the way back up).
 *
 * The heading is real text in the DOM — words are inline spans separated by
 * normal spaces — so SEO, copy/paste and screen readers see the sentence.
 * The resting (hidden) state is CSS (`.gn-reveal-word`), gated on
 * `prefers-reduced-motion: no-preference`, so reduced-motion users simply get
 * the finished heading and no animation is created for them.
 */
export function ScrollRevealHeading({
  children,
  as: Tag = "h2",
  id,
  className,
  start = "top 98%",
  end = "top 40%",
}: ScrollRevealHeadingProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const words = children.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = el.querySelectorAll(".gn-reveal-word");
      gsap.fromTo(
        targets,
        { opacity: 0.15, filter: "blur(10px)", y: 14 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          ease: "power1.out",
          duration: WORD_DURATION,
          stagger: WORD_STAGGER,
          scrollTrigger: { trigger: el, start, end, scrub: SCRUB },
        },
      );
    });

    return () => mm.revert();
  }, [start, end]);

  return (
    <Tag ref={ref} id={id} className={cn(className)}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="gn-reveal-word inline-block">{word}</span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}
