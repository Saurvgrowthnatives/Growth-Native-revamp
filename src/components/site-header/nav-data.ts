export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type SolutionsPillar = {
  label: string;
  href: string;
  capabilities: string[];
};

export const solutionsPillars: SolutionsPillar[] = [
  {
    label: "Grow Revenue",
    href: "/solutions/grow-revenue",
    capabilities: [
      "Lifecycle Marketing",
      "Demand Generation",
      "Performance",
      "Personalization",
      "Conversion",
      "Sales Enablement",
    ],
  },
  {
    label: "Modernize Operations",
    href: "/solutions/modernize-operations",
    capabilities: [
      "RevOps",
      "Marketing Operations",
      "CRM",
      "Salesforce",
      "HubSpot",
      "Automation",
      "Process Design",
    ],
  },
  {
    label: "Activate AI + Data",
    href: "/solutions/activate-ai-data",
    capabilities: [
      "AI Automation",
      "Analytics",
      "Predictive Models",
      "AI Agents",
      "Data Integration",
      "Measurement",
    ],
  },
  {
    label: "Build Digital Experiences",
    href: "/solutions/build-digital-experiences",
    capabilities: [
      "UX / UI",
      "Web",
      "Product Design",
      "Front-End Engineering",
      "Creative",
      "Experimentation",
    ],
  },
];

export type NavItem = {
  label: string;
  href: string;
  megaMenu?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Solutions", href: "/solutions", megaMenu: true },
  { label: "Growth Pods", href: "/growth-pods" },
  { label: "AI Labs", href: "/ai-labs" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Company", href: "/company" },
];

export const primaryCta: NavLink = {
  label: "Talk to an Expert",
  href: "/talk-to-an-expert",
};
