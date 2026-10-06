import {
  Bot,
  FlaskConical,
  LifeBuoy,
  LineChart,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { AI_FEATURES } from "./content";

// One line icon per feature, chosen to match its theme — the live section
// carries only photos, so this mapping is ours and not part of the CMS copy.
const BY_ID: Record<string, LucideIcon> = {
  "icp-targeting": Target,
  "sales-assist-automation": Bot,
  "autonomous-service-ops": LifeBuoy,
  "revops-orchestration": Workflow,
  "ai-led-gtm-execution": Rocket,
  "ml-driven-buying": TrendingUp,
  "dynamic-personalization": Sparkles,
  "predictive-performance-modeling": LineChart,
  "ai-augmented-ux-testing": FlaskConical,
};

/**
 * Resolved once at module scope, in the same order as AI_FEATURES, so a
 * component is only ever *looked up* during render, never produced by a call.
 */
export const FEATURE_ICONS: LucideIcon[] = AI_FEATURES.map(
  (feature) => BY_ID[feature.id] ?? Target,
);
