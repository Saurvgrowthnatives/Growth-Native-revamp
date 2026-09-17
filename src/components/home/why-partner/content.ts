export type Metric = {
  id: string;
  value: string;
  label: string;
  description: string;
};

export const WHY_PARTNER = {
  eyebrow: "Why Partner With Growth Natives?",
  heading: "We're not another agency. We're your AI-Native growth engine.",
  description:
    "We don't just plug into your operations—we power it. From strategy to delivery, our AI-first approach unlocks growth at every layer of your funnel.",
};

export const METRICS: Metric[] = [
  {
    id: "brands",
    value: "200+",
    label: "Brands trust us for AI",
    description:
      "Delivering real business impact using intelligent, scalable solutions.",
  },
  {
    id: "retention",
    value: "94%",
    label: "Client Retention Since 2019",
    description: "Brands love growth we enable and keep coming back for more.",
  },
  {
    id: "ops",
    value: "3x",
    label: "Ops Efficiency in the First 90 Days",
    description: "Mastering the art of growth and operational efficiency.",
  },
  {
    id: "models",
    value: "15+",
    label: "AI Models Deployed in Production",
    description:
      "Automations that drive up to 300% efficiency, so you can do more.",
  },
];
