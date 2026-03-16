import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import ChartContainer from "./ChartContainer";
import { AXIS_STYLE, GRID_STYLE, TOOLTIP_STYLE } from "./chartTheme";

const BANDS = [
  { band: "0–20", label: "Safe", count: 412, color: "#22C55E" },
  { band: "20–40", label: "Low", count: 287, color: "#22D3EE" },
  { band: "40–60", label: "Medium", count: 198, color: "#F59E0B" },
  { band: "60–80", label: "High", count: 143, color: "#F97316" },
  { band: "80–100", label: "Critical", count: 89, color: "#F43F5E" },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const d = BANDS.find((b) => b.band === label);
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <p style={{ ...TOOLTIP_STYLE.labelStyle, color: d?.color }}>
        {d?.label} Risk ({label})
      </p>
      <p style={{ color: "#F8FAFC", fontWeight: 700, fontSize: 13 }}>
        {payload[0].value} transactions
      </p>
    </div>
  );
};

// ─── Custom bar label ─────────────────────────────────────────────────────────
const BarLabel = ({ x, y, width, value }) => (
  <text
    x={x + width / 2}
    y={y - 5}
    fill="#475569"
    fontSize={10}
    textAnchor="middle"
  >
    {value}
  </text>
);

const RiskBandChart = ({ size = "md", delay = 0 }) => {
  const total = useMemo(() => BANDS.reduce((s, b) => s + b.count, 0), []);
  const { height } = {
    sm: { height: 160 },
    md: { height: 220 },
    lg: { height: 280 },
  }[size] || { height: 220 };

  return (
    <ChartContainer
      title="Risk Score Distribution"
      subtitle={`${total} transactions across risk bands`}
      size={size}
      delay={delay}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={BANDS}
          margin={{ top: 20, right: 8, left: -20, bottom: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid {...GRID_STYLE} />
          <XAxis
            dataKey="band"
            tick={AXIS_STYLE.tick}
            axisLine={AXIS_STYLE.axisLine}
            tickLine={AXIS_STYLE.tickLine}
          />
          <YAxis
            tick={AXIS_STYLE.tick}
            axisLine={AXIS_STYLE.axisLine}
            tickLine={AXIS_STYLE.tickLine}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} label={<BarLabel />}>
            {BANDS.map((b, i) => (
              <Cell
                key={i}
                fill={b.color}
                fillOpacity={0.85}
                style={{ filter: `drop-shadow(0 0 8px ${b.color}50)` }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RiskBandChart;
