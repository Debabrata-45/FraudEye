import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from "lucide-react";
import { CHART_COLORS, TOOLTIP_STYLE } from "./chartTheme";

// ─── Sparkline ────────────────────────────────────────────────────────────────
const Sparkline = ({ data, color, height = 40 }) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
      <Line
        type="monotone"
        dataKey="v"
        stroke={color}
        strokeWidth={1.5}
        dot={false}
        activeDot={{ r: 3, fill: color, stroke: "#0F172A", strokeWidth: 1 }}
      />
      <Tooltip
        content={({ active, payload }) =>
          active && payload?.length ? (
            <div style={{ ...TOOLTIP_STYLE.contentStyle, padding: "6px 10px" }}>
              <span style={{ color: "#F8FAFC", fontSize: 12, fontWeight: 700 }}>
                {payload[0].value}
              </span>
            </div>
          ) : null
        }
        cursor={false}
      />
    </LineChart>
  </ResponsiveContainer>
);

// ─── Trend icon ───────────────────────────────────────────────────────────────
const TrendIcon = ({ direction }) => {
  if (direction === "up")
    return <TrendingUp size={14} className="text-rose-400" />;
  if (direction === "down")
    return <TrendingDown size={14} className="text-emerald-400" />;
  return <Minus size={14} className="text-slate-500" />;
};

// ─── Mini insight card ────────────────────────────────────────────────────────
const InsightMini = ({
  title,
  value,
  delta,
  direction,
  color,
  sparkData,
  caption,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.06 * index }}
    className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5"
  >
    <div className="flex items-start justify-between gap-2 mb-2">
      <div>
        <p className="text-[11px] text-slate-500 font-medium">{title}</p>
        <p
          className="text-xl font-black tabular-nums leading-none mt-1"
          style={{ color }}
        >
          {value}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <TrendIcon direction={direction} />
        <span
          className={`text-[11px] font-bold tabular-nums ${
            direction === "up"
              ? "text-rose-400"
              : direction === "down"
                ? "text-emerald-400"
                : "text-slate-500"
          }`}
        >
          {delta}
        </span>
      </div>
    </div>
    <Sparkline data={sparkData} color={color} />
    <p className="text-[10px] text-slate-600 mt-1.5 leading-snug">{caption}</p>
  </motion.div>
);

// ─── Anomaly spike indicator ──────────────────────────────────────────────────
const AnomalySpike = ({ data, index }) => {
  const max = Math.max(...data.map((d) => d.v));
  const spikeIdx = data.findIndex((d) => d.v === max);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.06 * index }}
      className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <AlertTriangle size={12} className="text-rose-400" />
        <p className="text-[11px] font-semibold text-rose-300">
          Anomaly Spike Detected
        </p>
      </div>
      <div style={{ height: 48 }}>
        <ResponsiveContainer width="100%" height={48}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
          >
            <ReferenceLine
              x={spikeIdx}
              stroke="#F43F5E"
              strokeDasharray="3 3"
              strokeOpacity={0.6}
            />
            <Line
              type="monotone"
              dataKey="v"
              stroke="#F43F5E"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-[10px] text-rose-300/60 mt-1.5">
        Velocity spike at {data[spikeIdx]?.label || "peak"} — {max} events/hr
      </p>
    </motion.div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AIInsightsMinis = () => {
  const anomalyData = useMemo(
    () => [
      { v: 8, label: "00:00" },
      { v: 11, label: "02:00" },
      { v: 9, label: "04:00" },
      { v: 14, label: "06:00" },
      { v: 22, label: "08:00" },
      { v: 18, label: "10:00" },
      { v: 41, label: "12:00" },
      { v: 19, label: "14:00" },
      { v: 16, label: "16:00" },
      { v: 24, label: "18:00" },
      { v: 31, label: "20:00" },
      { v: 28, label: "22:00" },
    ],
    [],
  );

  const riskDriftData = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({ v: 62 + i * 1.5 + (i % 3) * 2 })),
    [],
  );

  const queueData = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ v: 8 + i * 1.2 + (i % 2) })),
    [],
  );

  const confData = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ v: 88 - i * 0.5 + (i % 3) })),
    [],
  );

  return (
    <div className="grid grid-cols-2 gap-3">
      <AnomalySpike data={anomalyData} index={0} />

      <InsightMini
        index={1}
        title="Risk Score Drift"
        value="↑ 4.2"
        delta="+4.2 pts"
        direction="up"
        color={CHART_COLORS.orange}
        sparkData={riskDriftData}
        caption="7-day rolling average risk drifting upward"
      />

      <InsightMini
        index={2}
        title="Queue Pressure"
        value="19"
        delta="+7 cases"
        direction="up"
        color={CHART_COLORS.suspicious}
        sparkData={queueData}
        caption="Review queue growing — analyst capacity needed"
      />

      <InsightMini
        index={3}
        title="Model Confidence"
        value="91%"
        delta="-0.8%"
        direction="down"
        color={CHART_COLORS.cyan}
        sparkData={confData}
        caption="Slight confidence dip — monitor for drift"
      />
    </div>
  );
};

export default AIInsightsMinis;
