export type AiFeature = {
  id: string;
  title: string;
  description: string;
};

// The nine existing "Our AI Difference" features, transcribed from the live
// section. Titles and descriptions are reproduced as-is — do not rewrite,
// shorten or add to this copy.
export const AI_FEATURES: AiFeature[] = [
  {
    id: "icp-targeting",
    title: "Targeting Your Ideal Customer Profiles",
    description:
      "Finds your best-fit accounts, scores them fast, and keeps that ICP sharp.",
  },
  {
    id: "sales-assist-automation",
    title: "Sales Assist Automation",
    description:
      "Lead qual, follow-ups, CRM updates, handled. Your reps just sell.",
  },
  {
    id: "autonomous-service-ops",
    title: "Autonomous Service Ops",
    description:
      "Self-running support ops. Calm queues. Safe SLAs. Fast resolutions.",
  },
  {
    id: "revops-orchestration",
    title: "RevOps Orchestration",
    description:
      "Handoffs, hygiene, next steps, AI keeps the funnel moving without babysitting.",
  },
  {
    id: "ai-led-gtm-execution",
    title: "AI-Led GTM Execution",
    description:
      "Signals in. GTM plays out. Less manual work, more momentum.",
  },
  {
    id: "ml-driven-buying",
    title: "ML-Driven Buying",
    description:
      "Real-time budget shifts. Smarter ad decisions on autopilot.",
  },
  {
    id: "dynamic-personalization",
    title: "Dynamic Personalization",
    description:
      "Content that shape-shifts by persona and intent, automatically.",
  },
  {
    id: "predictive-performance-modeling",
    title: "Predictive Performance Modeling",
    description: "See what'll win early. Scale it before it's obvious.",
  },
  {
    id: "ai-augmented-ux-testing",
    title: "AI-Augmented UX Testing",
    description:
      "Real users, real behavior, real answers. No opinion wars.",
  },
];
