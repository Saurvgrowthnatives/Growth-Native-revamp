export type AuditStep = {
  id: "audit" | "opportunity-map" | "execution-plan";
  number: string;
  title: string;
  points: [string, string, string];
};

// From the live "AI Readiness Audit" block on growthnatives.com (CMS
// `progress_bar_tabs`). Copy is verbatim — only stray whitespace trimmed.
export const AI_READINESS_SECTION = {
  eyebrow: "AI Readiness Audit",
  heading: "Start Smart.",
  highlightedHeading: "Stay Scalable.",
  description:
    "Our free AI-readiness audit breaks down your ops, stack, and workflows-and shows you the things you're not doing (but should be).",
  // Live site points to /contact-us/; this rebuild's contact route is
  // /talk-to-an-expert (the site-wide primary CTA).
  cta: { label: "Book my Audit", href: "/talk-to-an-expert" },
};

export const AUDIT_STEPS: AuditStep[] = [
  {
    id: "audit",
    number: "01",
    title: "Audit",
    points: [
      "Current tech stack analysis",
      "Workflow efficiency assessment",
      "Identify AI gaps fast",
    ],
  },
  {
    id: "opportunity-map",
    number: "02",
    title: "Opportunity Map",
    points: [
      "Spot untapped growth levers",
      "ROI projection modelling",
      "Build AI action roadmap",
    ],
  },
  {
    id: "execution-plan",
    number: "03",
    title: "Execution Plan",
    points: [
      "Define rollout phases clearly",
      "Resource allocation strategy",
      "Scale with continuous learning",
    ],
  },
];
