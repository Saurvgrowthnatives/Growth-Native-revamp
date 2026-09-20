export type Service = {
  id: string;
  title: string;
  description: string;
  image: string;
  href: string;
};

// From the live "What We Do" section on growthnatives.com
// (CMS block `vertical_tab_slider`). Heading, subtitle and descriptions are verbatim; the
// card titles were shortened on request so each fits on one line — keep them short.
export const WHAT_WE_DO = {
  eyebrow: "What We Do",
  title: "Full-Stack Firepower. AI-Native Execution for Full-Funnel Growth",
  subtitle:
    "Our work spans strategy, code, creative, and AI-fueled ops-so your growth isn't just good-looking, it's scalable.",
};

// The live CMS data carries no per-service link, so every card points at the
// Solutions hub until real destinations are supplied. Change `href` per service.
const SOLUTIONS_HUB = "/solutions";

// Card images are dummy Lorem Picsum photos (self-hosted in
// public/images/services/) — replace with real per-service art before launch.
export const SERVICES: Service[] = [
  {
    id: "marketing-automation",
    title: "AI Marketing Automation",
    description:
      "AI-triggered workflows. Agent-led engagement. Zero manual bottlenecks.",
    image: "/images/services/marketing-automation.jpg",
    href: SOLUTIONS_HUB,
  },
  {
    id: "revops",
    title: "AI-Led RevOps",
    description:
      "Predictive revenue engines, automated handoffs, and frictionless GTM motion.",
    image: "/images/services/revops.jpg",
    href: SOLUTIONS_HUB,
  },
  {
    id: "agentforce-salesforce",
    title: "Agentforce + Salesforce",
    description:
      "AI agents inside your CRM. Sales, Service, and Marketing — thinking, acting, optimizing.",
    image: "/images/services/agentforce-salesforce.jpg",
    href: SOLUTIONS_HUB,
  },
  {
    id: "performance-marketing",
    title: "ML Performance Marketing",
    description:
      "Campaigns that self-optimize. Budgets that rebalance. Growth that compounds.",
    image: "/images/services/performance-marketing.jpg",
    href: SOLUTIONS_HUB,
  },
  {
    id: "web-mobile-development",
    title: "AI Web & Mobile Development",
    description:
      "Intelligent architecture. Adaptive interfaces. Code that evolves with your users.",
    image: "/images/services/web-mobile-development.jpg",
    href: SOLUTIONS_HUB,
  },
  {
    id: "analytics",
    title: "AI-Powered Analytics",
    description:
      "Predictive dashboards. Attribution clarity. Signals that drive revenue action.",
    image: "/images/services/analytics.jpg",
    href: SOLUTIONS_HUB,
  },
  {
    id: "creative-experience-design",
    title: "Generative AI Creative & UX",
    description: "Content, UX, design augmented by AI, built for conversion.",
    image: "/images/services/creative-experience-design.jpg",
    href: SOLUTIONS_HUB,
  },
];
