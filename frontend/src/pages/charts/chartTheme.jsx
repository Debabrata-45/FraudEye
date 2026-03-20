// ─── FraudEye locked chart theme ─────────────────────────────────────────────
// All chart components must import from here — never hard-code colors

export const CHART_COLORS = {
  fraud: "#F43F5E",
  suspicious: "#F59E0B",
  legitimate: "#22C55E",
  cyan: "#22D3EE",
  violet: "#8B5CF6",
  orange: "#F97316",
  slate: "#475569",
  muted: "#334155",

  // Gradient fills (start → end)
  fraudGrad: ["#F43F5E", "#7F1D1D"],
  cyangGrad: ["#22D3EE", "#0E7490"],
  violetGrad: ["#8B5CF6", "#4C1D95"],
  legitGrad: ["#22C55E", "#14532D"],
  suspiciousGrad: ["#F59E0B", "#78350F"],
};

// ─── Palette sequences for multi-series ──────────────────────────────────────
export const SERIES_PALETTE = [
  "#22D3EE",
  "#8B5CF6",
  "#F43F5E",
  "#22C55E",
  "#F59E0B",
  "#F97316",
  "#06B6D4",
  "#A78BFA",
];

// ─── Axis styling ─────────────────────────────────────────────────────────────
export const AXIS_STYLE = {
  tick: {
    fill: "#475569",
    fontSize: 11,
    fontFamily: "inherit",
  },
  axisLine: { stroke: "#1E293B" },
  tickLine: { stroke: "transparent" },
};

// ─── Grid styling ─────────────────────────────────────────────────────────────
export const GRID_STYLE = {
  stroke: "#1E293B",
  strokeDasharray: "3 3",
  vertical: false,
};

// ─── Tooltip style (inline) ───────────────────────────────────────────────────
export const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "#0F172A",
    border: "1px solid #334155",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    padding: "10px 14px",
    fontSize: "12px",
    fontFamily: "inherit",
  },
  labelStyle: {
    color: "#94A3B8",
    fontSize: "11px",
    marginBottom: "4px",
    fontWeight: 600,
  },
  itemStyle: {
    color: "#F8FAFC",
    padding: "1px 0",
  },
  cursor: { stroke: "#334155", strokeWidth: 1 },
};

// ─── Legend style ─────────────────────────────────────────────────────────────
export const LEGEND_STYLE = {
  wrapperStyle: {
    fontSize: "11px",
    color: "#94A3B8",
    paddingTop: "8px",
  },
};

// ─── Chart card size tokens ───────────────────────────────────────────────────
export const CHART_SIZES = {
  sm: { height: 160, className: "h-40" },
  md: { height: 220, className: "h-56" },
  lg: { height: 280, className: "h-72" },
  xl: { height: 340, className: "h-[340px]" },
};

// ─── Gradient defs helper — returns <defs> JSX id references ─────────────────
export const GRADIENT_IDS = {
  fraud: "gradFraud",
  cyan: "gradCyan",
  violet: "gradViolet",
  legit: "gradLegit",
  suspicious: "gradSuspicious",
};

// ─── Recharts gradient def blocks ────────────────────────────────────────────
export const GradientDefs = () => (
  <defs>
    <linearGradient id={GRADIENT_IDS.fraud} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F43F5E" stopOpacity={0.35} />
      <stop offset="100%" stopColor="#F43F5E" stopOpacity={0.02} />
    </linearGradient>
    <linearGradient id={GRADIENT_IDS.cyan} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.3} />
      <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.02} />
    </linearGradient>
    <linearGradient id={GRADIENT_IDS.violet} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.28} />
      <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.02} />
    </linearGradient>
    <linearGradient id={GRADIENT_IDS.legit} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#22C55E" stopOpacity={0.28} />
      <stop offset="100%" stopColor="#22C55E" stopOpacity={0.02} />
    </linearGradient>
    <linearGradient id={GRADIENT_IDS.suspicious} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.28} />
      <stop offset="100%" stopColor="#F59E0B" stopOpacity={0.02} />
    </linearGradient>
  </defs>
);

// ─── Dot renderer helpers ─────────────────────────────────────────────────────
export const makeActiveDot =
  (color) =>
  ({ cx, cy }) => (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill={color}
      stroke="#0F172A"
      strokeWidth={2}
      style={{ filter: `drop-shadow(0 0 6px ${color})` }}
    />
  );

export const makeInactiveDot = () => () => null;
