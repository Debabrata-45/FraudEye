import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

const generateDecisionData = () =>
  Array.from({ length: 14 }, (_, i) => ({
    date: format(subDays(new Date(), 13 - i), "MMM dd"),
    confirmed: 4 + Math.floor(i * 0.5 + Math.random() * 4),
    cleared: 8 + Math.floor(Math.random() * 5),
    escalated: 2 + Math.floor(Math.random() * 3),
    pending: 12 - Math.floor(i * 0.3),
  }));

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={TOOLTIP_STYLE.contentStyle}>
      <p style={TOOLTIP_STYLE.labelStyle}>{label}</p>
      {[...payload].reverse().map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.color }}
          />
          <span style={{ color: "#94A3B8", fontSize: 11 }}>{p.name}:</span>
          <span style={{ color: "#F8FAFC", fontWeight: 700 }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const DecisionTrendChart = ({ size = "md", delay = 0 }) => {
  const data = useMemo(() => generateDecisionData(), []);
  const { height } = {
    sm: { height: 160 },
    md: { height: 220 },
    lg: { height: 280 },
  }[size] || { height: 220 };

  return (
    <ChartContainer
      title="Analyst Decision Trends"
      subtitle="14-day review outcome breakdown"
      size={size}
      delay={delay}
      legend={[
        { color: CHART_COLORS.fraud, label: "Confirmed Fraud" },
        { color: CHART_COLORS.legitimate, label: "Cleared" },
        { color: CHART_COLORS.violet, label: "Escalated" },
        { color: CHART_COLORS.slate, label: "Pending" },
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
            tick={AXIS_STYLE.tick}
            axisLine={AXIS_STYLE.axisLine}
            tickLine={AXIS_STYLE.tickLine}
            interval={3}
          />
          <YAxis
            tick={AXIS_STYLE.tick}
            axisLine={AXIS_STYLE.axisLine}
            tickLine={AXIS_STYLE.tickLine}
          />
          <Tooltip content={<CustomTooltip />} cursor={TOOLTIP_STYLE.cursor} />
          <Area
            type="monotone"
            dataKey="pending"
            name="Pending"
            stroke={CHART_COLORS.slate}
            strokeWidth={1.5}
            fill={`url(#${GRADIENT_IDS.cyan})`}
            dot={makeInactiveDot()()}
            activeDot={makeActiveDot(CHART_COLORS.slate)}
          />
          <Area
            type="monotone"
            dataKey="escalated"
            name="Escalated"
            stroke={CHART_COLORS.violet}
            strokeWidth={1.5}
            fill={`url(#${GRADIENT_IDS.violet})`}
            dot={makeInactiveDot()()}
            activeDot={makeActiveDot(CHART_COLORS.violet)}
          />
          <Area
            type="monotone"
            dataKey="cleared"
            name="Cleared"
            stroke={CHART_COLORS.legitimate}
            strokeWidth={1.5}
            fill={`url(#${GRADIENT_IDS.legit})`}
            dot={makeInactiveDot()()}
            activeDot={makeActiveDot(CHART_COLORS.legitimate)}
          />
          <Area
            type="monotone"
            dataKey="confirmed"
            name="Confirmed Fraud"
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

export default DecisionTrendChart;
