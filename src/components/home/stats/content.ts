export type Stat = {
  id: string;
  value: string;
  label: string;
};

// From the live `counter_up_grid_section` block on growthnatives.com.
// Numbers, suffixes and labels are verbatim — do not change or add stats.
export const STATS: Stat[] = [
  {
    id: "customers",
    value: "300+",
    label: "Customers Worldwide Put Faith In Us",
  },
  {
    id: "experts",
    value: "300+",
    label: "Digital Transformation Experts",
  },
  {
    id: "experience",
    value: "1500+",
    label: "Years Of Collective Experience",
  },
];
