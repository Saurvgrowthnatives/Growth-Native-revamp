"use client";

import { useId } from "react";

/*
 * Motion scenes for the three AI Readiness cards — each tells its step's
 * story in ~7s, matched to the carousel's 8s progress bar.
 *
 * Canvas: 600×360. Three cards sit side by side, so each scene renders at
 * roughly 380–420px wide; type is sized (16–17 units) to stay readable at
 * that scale, and captions that are secondary carry `gn-ar-minor`, which
 * the stylesheet hides when the card is narrower than ~330px (phones), so
 * a small card shows the key labels only rather than a cluttered scene.
 *
 * Convention (see `.gn-ar-*` in globals.css): an element's own styles are
 * its FINAL frame, and its animation starts from the initial state with
 * fill-mode `both`. A scene that isn't playing (inactive card, reduced
 * motion) therefore just shows the finished picture, and a playing scene
 * holds that same picture once its story ends. Everything animates with
 * transform / opacity / stroke-dashoffset only.
 */

const OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
const IN_OUT = "cubic-bezier(0.65, 0, 0.35, 1)";

const anim = (
  name: string,
  dur: number,
  delay: number,
  ease = OUT,
  extra = "both",
) => `${name} ${dur}s ${ease} ${delay}s ${extra}`;

const fade = (delay: number, dur = 0.6) => ({ animation: anim("gn-ar-fade", dur, delay) });
const rise = (delay: number, dur = 0.7) => ({ animation: anim("gn-ar-rise", dur, delay) });
const pop = (delay: number, dur = 0.55) => ({ animation: anim("gn-ar-pop", dur, delay) });
// looping pings only start once their element is revealed; no fill, so the
// (invisible) base state shows during the delay and when not playing
const ping = (delay: number, name = "gn-ar-ping", dur = 1.8) => ({
  animation: anim(name, dur, delay, "ease-out", "infinite"),
});

function useSvgId(prefix: string) {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

const WHITE = (a: number) => `rgba(255,255,255,${a})`;
const BLUE = "#0074F8";
const BLUE_LIGHT = "#4DA3FF";
const GREEN = "#19C027";

const SVG_PROPS = {
  viewBox: "0 0 600 360",
  preserveAspectRatio: "xMidYMid meet",
  className: "absolute inset-0 h-full w-full",
  "aria-hidden": true,
} as const;

function Pill({
  x,
  y,
  width,
  label,
  dot,
  delay,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  dot: string;
  delay: number;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g style={fade(delay)}>
        <rect width={width} height={36} rx={18} fill={WHITE(0.06)} stroke={WHITE(0.12)} />
        <circle cx={20} cy={18} r={9} fill={dot} className="gn-ar-tb" opacity={0} style={ping(delay + 0.4)} />
        <circle cx={20} cy={18} r={5} fill={dot} />
        <text x={36} y={23.5} fontSize={16} fontWeight={500} fill={WHITE(0.88)}>
          {label}
        </text>
      </g>
    </g>
  );
}

function Chip({
  cx,
  y,
  width,
  label,
  delay,
  tone = "neutral",
}: {
  cx: number;
  y: number;
  width: number;
  label: string;
  delay: number;
  tone?: "neutral" | "green";
}) {
  const green = tone === "green";
  return (
    <g transform={`translate(${cx - width / 2} ${y})`}>
      <g className="gn-ar-tb" style={pop(delay)}>
        <rect
          width={width}
          height={34}
          rx={17}
          fill={green ? "rgba(25,192,39,0.12)" : WHITE(0.08)}
          stroke={green ? "rgba(25,192,39,0.7)" : WHITE(0.18)}
        />
        <text
          x={width / 2}
          y={22}
          textAnchor="middle"
          fontSize={16}
          fontWeight={500}
          fill={green ? "#7BE584" : WHITE(0.9)}
        >
          {label}
        </text>
      </g>
    </g>
  );
}

/* ───────────────────────── 01 · Audit ─────────────────────────
   A stack of tools rises in, a scan beam sweeps across lighting each tool
   as it passes, two empty slots resolve into flagged AI gaps, then a
   workflow-efficiency meter fills and the finding lands. */

const TILE_W = 120;
const TILE_H = 62;
const TILE_GAP = 16;
const GRID_X = 36;
const GRID_Y = 84;
const ROW_STEP = 78;
const SCAN_FROM = GRID_X - 12;
const SCAN_TRAVEL = 4 * TILE_W + 3 * TILE_GAP + 24;
const SCAN_START = 1.3;
const SCAN_DUR = 2.4;

const TILES: { label: string; gap?: boolean }[] = [
  { label: "CRM" },
  { label: "Email" },
  { label: "Ads" },
  { label: "Analytics" },
  { label: "CMS" },
  { label: "AI gap", gap: true },
  { label: "Data" },
  { label: "AI gap", gap: true },
];

export function AuditScene() {
  const beam = useSvgId("ar-beam");
  const meter = useSvgId("ar-meter");

  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id={beam} x1="0" x2="1">
          <stop offset="0" stopColor={BLUE} stopOpacity="0" />
          <stop offset="1" stopColor={BLUE_LIGHT} stopOpacity="0.38" />
        </linearGradient>
        <linearGradient id={meter} x1="0" x2="1">
          <stop offset="0" stopColor={BLUE} />
          <stop offset="1" stopColor={GREEN} />
        </linearGradient>
      </defs>

      <Pill x={36} y={24} width={248} label="Tech stack analysis" dot={GREEN} delay={0.1} />

      {TILES.map((tile, i) => {
        const col = i % 4;
        const row = Math.floor(i / 4);
        const x = GRID_X + col * (TILE_W + TILE_GAP);
        const y = GRID_Y + row * ROW_STEP;
        // the moment the beam crosses this tile's centre
        const lit =
          SCAN_START + ((x + TILE_W / 2 - SCAN_FROM) / SCAN_TRAVEL) * SCAN_DUR;

        return (
          <g key={i} transform={`translate(${x} ${y})`}>
            {tile.gap ? (
              <>
                {/* empty slot, there from the start */}
                <g style={rise(0.25 + i * 0.07)}>
                  <rect width={TILE_W} height={TILE_H} rx={12} fill="none" stroke={WHITE(0.12)} strokeDasharray="4 5" />
                </g>
                {/* resolves into a flagged AI gap once scanned */}
                <rect
                  width={TILE_W}
                  height={TILE_H}
                  rx={12}
                  fill="none"
                  stroke={GREEN}
                  className="gn-ar-tb"
                  opacity={0}
                  style={ping(lit + 0.9, "gn-ar-ping-rect", 2)}
                />
                <g className="gn-ar-tb" style={pop(lit + 0.25)}>
                  <rect width={TILE_W} height={TILE_H} rx={12} fill="rgba(25,192,39,0.1)" stroke="rgba(25,192,39,0.85)" strokeDasharray="5 4" />
                  <text x={14} y={38} fontSize={17} fontWeight={600} fill="#7BE584">
                    {tile.label}
                  </text>
                  <path d={`M${TILE_W - 26} 16 l4.5 4.5 l8 -10`} fill="none" stroke={GREEN} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </>
            ) : (
              <g style={rise(0.25 + i * 0.07)}>
                <rect width={TILE_W} height={TILE_H} rx={12} fill={WHITE(0.04)} stroke={WHITE(0.16)} />
                {/* lit border once scanned */}
                <rect width={TILE_W} height={TILE_H} rx={12} fill="none" stroke={BLUE} strokeOpacity={0.7} style={fade(lit, 0.5)} />
                <text className="gn-ar-minor" x={14} y={38} fontSize={17} fontWeight={500} fill={WHITE(0.9)}>
                  {tile.label}
                </text>
                <circle cx={TILE_W - 16} cy={16} r={5} fill={BLUE_LIGHT} style={{ animation: anim("gn-ar-dot", 0.4, lit, "ease-out") }} />
              </g>
            )}
          </g>
        );
      })}

      {/* scan beam */}
      <g
        opacity={0}
        style={{
          ["--scan-x" as string]: `${SCAN_TRAVEL}px`,
          animation: anim("gn-ar-scan", SCAN_DUR, SCAN_START, "cubic-bezier(0.45,0,0.55,1)"),
        }}
      >
        <rect x={SCAN_FROM - 44} y={GRID_Y - 14} width={44} height={ROW_STEP + TILE_H + 28} fill={`url(#${beam})`} />
        <rect x={SCAN_FROM - 1} y={GRID_Y - 14} width={2} height={ROW_STEP + TILE_H + 28} rx={1} fill={BLUE_LIGHT} />
      </g>

      {/* workflow efficiency meter */}
      <g style={fade(4.0)}>
        <text className="gn-ar-minor" x={GRID_X} y={262} fontSize={16} fontWeight={500} fill={WHITE(0.65)}>
          Workflow efficiency
        </text>
        <rect x={GRID_X} y={276} width={528} height={8} rx={4} fill={WHITE(0.1)} />
      </g>
      <rect
        x={GRID_X}
        y={276}
        width={380}
        height={8}
        rx={4}
        fill={`url(#${meter})`}
        className="gn-ar-tb"
        style={{ transformOrigin: "0% 50%", animation: anim("gn-ar-grow-x", 1.5, 4.2, IN_OUT) }}
      />

      <Chip cx={460} y={312} width={208} label="AI gaps identified" delay={5.9} tone="green" />
    </svg>
  );
}

/* ─────────────────────── 02 · Opportunity Map ───────────────────────
   Against the current trajectory, a projected-ROI curve draws itself up
   and to the right; growth levers pin onto it in sequence, ending on the
   AI roadmap. */

// projected curve: P0(40,278) P1(210,272) P2(330,198) P3(560,98); marker
// points are that bezier at t ≈ 0.35, 0.68 and 1.
const CURVE = "M40 278 C 210 272, 330 198, 560 98";
const MARKERS = [
  { x: 207, y: 248.5, label: "Growth lever", width: 150, delay: 2.0, green: false },
  { x: 368, y: 184.6, label: "ROI projection", width: 170, delay: 2.65, green: false },
  { x: 560, y: 98, label: "AI roadmap", width: 132, delay: 3.4, green: true },
];

export function OpportunityScene() {
  const line = useSvgId("ar-line");
  const area = useSvgId("ar-area");

  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id={line} x1="0" x2="1">
          <stop offset="0" stopColor={BLUE} />
          <stop offset="1" stopColor={GREEN} />
        </linearGradient>
        <linearGradient id={area} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={BLUE} stopOpacity="0.32" />
          <stop offset="1" stopColor={BLUE} stopOpacity="0" />
        </linearGradient>
      </defs>

      <Pill x={36} y={24} width={198} label="Opportunity map" dot={BLUE_LIGHT} delay={0.1} />

      {/* grid */}
      <g style={fade(0.2, 0.8)}>
        {[110, 155, 200, 245].map((y) => (
          <line key={y} x1={40} x2={560} y1={y} y2={y} stroke={WHITE(0.07)} strokeDasharray="3 7" />
        ))}
        <line x1={40} x2={560} y1={300} y2={300} stroke={WHITE(0.16)} />
      </g>

      {/* current trajectory */}
      <path
        d="M40 278 C 220 276, 400 270, 560 266"
        fill="none"
        stroke={WHITE(0.3)}
        strokeWidth={2.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        style={{ animation: anim("gn-ar-draw", 1.1, 0.5, IN_OUT) }}
      />
      <text className="gn-ar-minor" x={560} y={290} textAnchor="end" fontSize={14} fill={WHITE(0.5)} style={fade(1.4)}>
        Current
      </text>

      {/* projected ROI */}
      <path d={`${CURVE} L560 300 L40 300 Z`} fill={`url(#${area})`} style={fade(2.2, 1.3)} />
      <path
        d={CURVE}
        fill="none"
        stroke={`url(#${line})`}
        strokeWidth={3.5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        style={{ animation: anim("gn-ar-draw", 2.4, 1.0, IN_OUT) }}
      />

      {MARKERS.map((m) => {
        const tone = m.green ? GREEN : BLUE;
        const chipCx = m.x === 560 ? 508 : m.x;
        return (
          <g key={m.label}>
            <g transform={`translate(${m.x} ${m.y})`}>
              <circle r={8} fill="none" stroke={tone} className="gn-ar-tb" opacity={0} style={ping(m.delay + 0.5)} />
              <g className="gn-ar-tb" style={pop(m.delay)}>
                <circle r={12} fill={tone} fillOpacity={0.22} />
                <circle r={5.5} fill="#fff" stroke={tone} strokeWidth={2.5} />
              </g>
            </g>
            <line x1={m.x} x2={m.x} y1={m.y - 16} y2={m.y - 10} stroke={WHITE(0.32)} style={fade(m.delay + 0.15)} />
            <Chip cx={chipCx} y={m.y - 50} width={m.width} label={m.label} delay={m.delay + 0.15} tone={m.green ? "green" : "neutral"} />
          </g>
        );
      })}

      {/* legend */}
      <g className="gn-ar-minor" style={fade(3.9)}>
        <line x1={40} x2={62} y1={334} y2={334} stroke={WHITE(0.34)} strokeWidth={2.5} strokeLinecap="round" />
        <text x={70} y={339} fontSize={14} fill={WHITE(0.55)}>
          Current
        </text>
        <line x1={150} x2={172} y1={334} y2={334} stroke={`url(#${line})`} strokeWidth={3.5} strokeLinecap="round" />
        <text x={180} y={339} fontSize={14} fill={WHITE(0.55)}>
          Projected ROI
        </text>
      </g>
    </svg>
  );
}

/* ─────────────────────── 03 · Execution Plan ───────────────────────
   Rollout phases lay down on a timeline in sequence, the team is allocated
   onto each phase, a playhead runs the plan, and the last phase closes in
   a continuous-learning loop that keeps turning. */

const TL_X = 110;
const PHASES = [
  { label: "Phase 1", task: "Define rollout", x: 110, w: 204, cy: 118, delay: 0.6, fill: "solid" as const },
  { label: "Phase 2", task: "Allocate resources", x: 215, w: 240, cy: 178, delay: 1.1, fill: "soft" as const },
  { label: "Phase 3", task: "Scale", x: 370, w: 190, cy: 238, delay: 1.6, fill: "grad" as const },
];
const PLAYHEAD_TRAVEL = 440;

function Person({ cx, cy, delay }: { cx: number; cy: number; delay: number }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      <g style={{ animation: anim("gn-ar-drop", 0.55, delay) }}>
        <circle r={12} fill="#0B1528" stroke={WHITE(0.75)} strokeWidth={1.6} />
        <circle cy={-3.5} r={4} fill={WHITE(0.9)} />
        <path d="M-7 7 a7 5.5 0 0 1 14 0" fill={WHITE(0.9)} />
      </g>
    </g>
  );
}

export function ExecutionScene() {
  const soft = useSvgId("ar-soft");
  const grad = useSvgId("ar-grad");

  return (
    <svg {...SVG_PROPS}>
      <defs>
        <linearGradient id={soft} x1="0" x2="1">
          <stop offset="0" stopColor={BLUE} stopOpacity="0.8" />
          <stop offset="1" stopColor={BLUE_LIGHT} stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={grad} x1="0" x2="1">
          <stop offset="0" stopColor={BLUE} />
          <stop offset="1" stopColor={GREEN} />
        </linearGradient>
      </defs>

      <Pill x={36} y={24} width={188} label="Execution plan" dot={BLUE_LIGHT} delay={0.1} />

      {/* timeline grid */}
      <g style={fade(0.2, 0.8)}>
        {Array.from({ length: 7 }, (_, i) => TL_X + i * 75).map((x) => (
          <line key={x} x1={x} x2={x} y1={98} y2={268} stroke={WHITE(0.07)} />
        ))}
      </g>

      {PHASES.map((p, i) => (
        <g key={p.label}>
          <text className="gn-ar-minor" x={28} y={p.cy + 5.5} fontSize={15.5} fontWeight={500} fill={WHITE(0.65)} style={fade(0.3 + i * 0.12)}>
            {p.label}
          </text>
          <g
            className="gn-ar-tb"
            style={{ transformOrigin: "0% 50%", animation: anim("gn-ar-grow-x", 0.9, p.delay, IN_OUT) }}
          >
            <rect
              x={p.x}
              y={p.cy - 18}
              width={p.w}
              height={36}
              rx={10}
              fill={p.fill === "solid" ? BLUE : p.fill === "soft" ? `url(#${soft})` : `url(#${grad})`}
            />
          </g>
          <text x={p.x + 14} y={p.cy + 5} fontSize={15} fontWeight={600} fill="#fff" style={fade(p.delay + 0.7)}>
            {p.task}
          </text>
        </g>
      ))}

      {/* resource allocation */}
      {PHASES.map((p, i) => (
        <g key={`team-${p.label}`}>
          <Person cx={p.x + p.w - 46} cy={p.cy} delay={2.6 + i * 0.3} />
          <Person cx={p.x + p.w - 20} cy={p.cy} delay={2.75 + i * 0.3} />
        </g>
      ))}

      {/* playhead runs the plan */}
      <g style={fade(3.3, 0.4)}>
        <g
          style={{
            transform: `translateX(${PLAYHEAD_TRAVEL}px)`,
            animation: anim("gn-ar-slide", 2.8, 3.4, "linear"),
          }}
        >
          <line x1={TL_X} x2={TL_X} y1={92} y2={272} stroke={WHITE(0.8)} strokeWidth={1.6} />
          <circle cx={TL_X} cy={90} r={4.5} fill="#fff" />
        </g>
      </g>

      {/* continuous learning loop */}
      <g transform="translate(318 317)">
        <g className="gn-ar-tb" style={pop(5.4)}>
          <circle r={18} fill="rgba(25,192,39,0.12)" />
          <g className="gn-ar-tb" style={{ animation: anim("gn-ar-spin", 2.6, 5.9, "linear", "infinite") }}>
            <path d="M0 -10 A10 10 0 1 1 -9.5 3" fill="none" stroke={GREEN} strokeWidth={2.4} strokeLinecap="round" />
            <path d="M-13 -1 l3.5 4.5 l4.5 -3.5" fill="none" stroke={GREEN} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </g>
      </g>
      <Chip cx={451} y={300} width={218} label="Continuous learning" delay={6.2} tone="green" />
    </svg>
  );
}
