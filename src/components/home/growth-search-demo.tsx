import { LineChart, Search, Users, Workflow, Zap } from "lucide-react";

type DemoRow = {
  icon: typeof Zap;
  iconBg: string;
  label: string;
  value: string;
  valueTone: "green" | "blue";
};

const ROWS: DemoRow[] = [
  {
    icon: Zap,
    iconBg: "#0074F8",
    label: "Predictive Lead Scoring",
    value: "Live",
    valueTone: "green",
  },
  {
    icon: Workflow,
    iconBg: "#19C027",
    label: "Marketing Automation Synced",
    value: "Active",
    valueTone: "green",
  },
  {
    icon: LineChart,
    iconBg: "gradient",
    label: "Revenue Ops Dashboard",
    value: "+28%",
    valueTone: "green",
  },
  {
    icon: Users,
    iconBg: "#484D57",
    label: "Growth Pod Deployed",
    value: "Ready",
    valueTone: "blue",
  },
];

const ROW_DELAYS = ["0s", "0.35s", "0.7s", "1.05s"];

export function GrowthSearchDemo() {
  return (
    <div className="relative mx-auto w-full max-w-[900px] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)] sm:p-6">
      {/* Search bar */}
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gn-blue/20 text-gn-blue">
          <Search className="h-4 w-4" aria-hidden />
        </span>
        <span className="text-[15px] font-medium text-white sm:text-base">
          <span className="gn-demo-type">Automate my growth stack</span>
          <span
            className="gn-demo-cursor ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-gn-blue align-middle"
            aria-hidden
          />
        </span>
      </div>

      {/* Result rows */}
      <div className="mt-3 flex flex-col gap-2.5">
        {ROWS.map((row, i) => {
          const Icon = row.icon;
          return (
            <div
              key={row.label}
              className="gn-demo-row flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3"
              style={{ animationDelay: ROW_DELAYS[i] }}
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white"
                style={{
                  background:
                    row.iconBg === "gradient"
                      ? "var(--gradient-gn-primary)"
                      : row.iconBg,
                }}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="flex-1 truncate text-left text-sm font-medium text-white/90 sm:text-[15px]">
                {row.label}
              </span>
              <span
                className={
                  "shrink-0 text-sm font-semibold sm:text-[15px] " +
                  (row.valueTone === "green" ? "text-[#3DDC5A]" : "text-[#4DA3FF]")
                }
              >
                {row.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
