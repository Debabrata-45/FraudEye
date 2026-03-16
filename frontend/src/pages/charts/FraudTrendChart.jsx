import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { subDays, format } from "date-fns";
import ChartContainer from "./ChartContainer";
import {
  GradientDefs,
  GRADIENT_IDS,
  CHART_COLORS,
  AXIS_STYLE,
  GRID_STYLE,
  TOOLTIP_STYLE,
  makeActiveDot,
  makeInactiveDot,
} from "./chartTheme";

// ─── Mock data ────────────────────────────────────────────────────────────────
const generateTrendData = () => {
  const base = [
    14, 18, 12, 22, 31, 19, 24, 28, 16, 20, 35, 29, 18, 22, 41, 33, 27, 19, 24,
    38, 30, 22, 17, 25, 32, 28, 19, 26,
  ];
  return base.map((fraud, i) => ({
    date: format(subDays(new Date(), 27 - i), "MMM dd"),
    fraud,
    suspicious: Math.round(fraud * 0.6 + Math.random() * 5),
    legitimate: Math.round(120 + Math.random() * 30),
  }));
};

// ─── Custom tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <p style={TOOLTIP_STYLE.labelStyle}>{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: p.color }}
          />
          <span style={{ color: "#94A3B8", fontSize: 11 }}>{p.name}:</span>
          <span style={{ color: "#F8FAFC", fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const FraudTrendChart = ({ size = "lg", delay = 0 }) => {
  const data = useMemo(() => generateTrendData(), []);
  const { height } = {
    sm: { height: 160 },
    md: { height: 220 },
    lg: { height: 280 },
    xl: { height: 340 },
  }[size] || { height: 280 };

  const avgFraud = Math.round(
    data.reduce((s, d) => s + d.fraud, 0) / data.length,
  );

  return (
    <ChartContainer
      title="Fraud Activity Trend"
      subtitle="28-day transaction fraud and suspicious volume"
      size={size}
      delay={delay}
      legend={[
        { color: CHART_COLORS.fraud, label: "Fraud" },
        { color: CHART_COLORS.suspicious, label: "Suspicious" },
        { color: CHART_COLORS.cyan, label: "Legitimate" },
      ]}
    >
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
        >
          <GradientDefs />
          <CartesianGrid {...GRID_STYLE} />
          <XAxis
            dataKey="date"
            {...AXIS_STYLE}
            interval={6}
            tick={AXIS_STYLE.tick}
            axisLine={AXIS_STYLE.axisLine}
            tickLine={AXIS_STYLE.tickLine}
          />
          <YAxis
            tick={AXIS_STYLE.tick}
            axisLine={AXIS_STYLE.axisLine}
            tickLine={AXIS_STYLE.tickLine}
          />
          <Tooltip content={<CustomTooltip />} cursor={TOOLTIP_STYLE.cursor} />
          <ReferenceLine
            y={avgFraud}
            stroke={CHART_COLORS.fraud}
            strokeDasharray="4 4"
            strokeOpacity={0.4}
            label={{
              value: "avg",
              fill: "#F43F5E",
              fontSize: 10,
              position: "right",
            }}
          />
          <Area
            type="monotone"
            dataKey="legitimate"
            name="Legitimate"
            stroke={CHART_COLORS.cyan}
            strokeWidth={1.5}
            fill={`url(#${GRADIENT_IDS.cyan})`}
            dot={makeInactiveDot()()}
            activeDot={makeActiveDot(CHART_COLORS.cyan)}
          />
          <Area
            type="monotone"
            dataKey="suspicious"
            name="Suspicious"
            stroke={CHART_COLORS.suspicious}
            strokeWidth={1.5}
            fill={`url(#${GRADIENT_IDS.suspicious})`}
            dot={makeInactiveDot()()}
            activeDot={makeActiveDot(CHART_COLORS.suspicious)}
          />
          <Area
            type="monotone"
            dataKey="fraud"
            name="Fraud"
            stroke={CHART_COLORS.fraud}
            strokeWidth={2}
            fill={`url(#${GRADIENT_IDS.fraud})`}
            dot={makeInactiveDot()()}
            activeDot={makeActiveDot(CHART_COLORS.fraud)}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default FraudTrendChart;
