/**
 * OverviewCharts.jsx — Analytics section
 * Charts: Fraud Trend Line, Risk Distribution, Hourly Velocity, Top Risky Merchants
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, Clock, PieChart as PieIcon, Store } from "lucide-react";
import { ChartEntrance } from "../../motion";
import { fadeUp, staggerNormal } from "../../motion";
import { cn } from "../../utils/cn";
import {
  MOCK_FRAUD_TREND,
  MOCK_RISK_DIST,
  MOCK_HOURLY,
  MOCK_RISKY_MERCHANTS,
} from "./overviewData";

/* ── Shared chart theme ──────────────────────────────────── */
const CHART_STYLE = {
  background: "transparent",
  fontSize: 11,
  fontFamily: "JetBrains Mono, monospace",
};

const GRID_STROKE = "#1E293B";
const TICK_COLOR = "#334155";
const TOOLTIP_STYLE = {
  backgroundColor: "#0D1627",
  border: "1px solid #1E293B",
  borderRadius: 8,
  fontSize: 11,
  color: "#94A3B8",
  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
};

/* ── Panel wrapper ───────────────────────────────────────── */
function ChartPanel({
  title,
  icon: _Icon,
  accent = "#22D3EE",
  children,
  className = "",
}) {
  return (
    <div
      className={cn(
        "bg-[#0D1627] border border-[#1E293B] rounded-xl overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#0F172A]">
        <span className="p-1 rounded-md" style={{ background: `${accent}14` }}>
          <_Icon size={13} strokeWidth={1.5} style={{ color: accent }} />
        </span>
        <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
          {title}
        </span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ── 1. Fraud Trend ──────────────────────────────────────── */
function FraudTrendChart() {
  return (
    <ChartPanel
      title="Fraud Trend — 14 Days"
      icon={TrendingUp}
      accent="#22D3EE"
      className="col-span-2"
    >
      <ChartEntrance>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={MOCK_FRAUD_TREND} style={CHART_STYLE}>
            <defs>
              <linearGradient id="grad-legit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22D3EE" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22D3EE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad-fraud" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={GRID_STROKE}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: TICK_COLOR, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: TICK_COLOR, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: "#F8FAFC", fontWeight: 600 }}
              cursor={{ stroke: "#334155", strokeWidth: 1 }}
            />
            <Area
              type="monotone"
              dataKey="legitimate"
              name="Legitimate"
              stroke="#22D3EE"
              strokeWidth={1.5}
              fill="url(#grad-legit)"
              dot={false}
              activeDot={{ r: 3, fill: "#22D3EE", stroke: "none" }}
            />
            <Area
              type="monotone"
              dataKey="fraud"
              name="Fraud"
              stroke="#F43F5E"
              strokeWidth={2}
              fill="url(#grad-fraud)"
              dot={false}
              activeDot={{ r: 3, fill: "#F43F5E", stroke: "none" }}
            />
          </AreaChart>
        </ResponsiveContainer>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-2">
          {[
            ["#22D3EE", "Legitimate"],
            ["#F43F5E", "Fraud"],
          ].map(([c, l]) => (
            <span
              key={l}
              className="flex items-center gap-1.5 text-[10px] text-[#475569]"
            >
              <span
                className="w-6 h-px inline-block"
                style={{ backgroundColor: c }}
              />
              {l}
            </span>
          ))}
        </div>
      </ChartEntrance>
    </ChartPanel>
  );
}

/* ── 2. Risk Distribution Donut ──────────────────────────── */
function RiskDistChart() {
  const [active, setActive] = useState(null);

  return (
    <ChartPanel title="Risk Distribution" icon={PieIcon} accent="#8B5CF6">
      <ChartEntrance>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={140} height={140}>
            <PieChart>
              <Pie
                data={MOCK_RISK_DIST}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={64}
                dataKey="value"
                strokeWidth={0}
                onMouseEnter={(_, i) => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {MOCK_RISK_DIST.map((entry, i) => (
                  <Cell
                    key={entry.name}
                    fill={entry.color}
                    opacity={active === null || active === i ? 1 : 0.35}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={(val) => [`${val}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="flex flex-col gap-2 flex-1">
            {MOCK_RISK_DIST.map((d, i) => (
              <div
                key={d.name}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="flex items-center justify-between cursor-default"
              >
                <span className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  {d.name}
                </span>
                <span
                  className="text-[11px] font-semibold font-mono"
                  style={{ color: d.color }}
                >
                  {d.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </ChartEntrance>
    </ChartPanel>
  );
}

/* ── 3. Hourly Velocity ──────────────────────────────────── */
function HourlyChart() {
  return (
    <ChartPanel
      title="Hourly Transaction Velocity"
      icon={Clock}
      accent="#F59E0B"
    >
      <ChartEntrance>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={MOCK_HOURLY} style={CHART_STYLE} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={GRID_STROKE}
              vertical={false}
            />
            <XAxis
              dataKey="hour"
              tick={{ fill: TICK_COLOR, fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: TICK_COLOR, fontSize: 9 }}
              axisLine={false}
              tickLine={false}
              width={24}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              cursor={{ fill: "#22D3EE08" }}
            />
            <Bar
              dataKey="txns"
              name="Transactions"
              fill="#22D3EE"
              fillOpacity={0.7}
              radius={[2, 2, 0, 0]}
            />
            <Bar
              dataKey="fraud"
              name="Fraud"
              fill="#F43F5E"
              fillOpacity={0.9}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartEntrance>
    </ChartPanel>
  );
}

/* ── 4. Top Risky Merchants ──────────────────────────────── */
function RiskyMerchantsChart() {
  return (
    <ChartPanel title="Top Risky Merchants" icon={Store} accent="#F43F5E">
      <ChartEntrance>
        <div className="space-y-3">
          {MOCK_RISKY_MERCHANTS.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.25 }}
              className="flex items-center gap-3 group"
            >
              {/* Rank */}
              <span className="text-[10px] font-mono text-[#334155] w-4 flex-shrink-0 text-right">
                {i + 1}
              </span>
              {/* Name + category */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-[#94A3B8] truncate">
                  {m.name}
                </p>
                <p className="text-[9px] text-[#334155] uppercase tracking-wider">
                  {m.category}
                </p>
              </div>
              {/* Risk bar */}
              <div className="w-20 h-1.5 bg-[#0F172A] rounded-full overflow-hidden flex-shrink-0">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor:
                      m.score > 0.85
                        ? "#F43F5E"
                        : m.score > 0.75
                          ? "#F59E0B"
                          : "#22D3EE",
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${m.score * 100}%` }}
                  transition={{
                    delay: 0.2 + i * 0.05,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                />
              </div>
              {/* Score */}
              <span
                className="text-[11px] font-bold font-mono w-8 text-right flex-shrink-0"
                style={{
                  color:
                    m.score > 0.85
                      ? "#F43F5E"
                      : m.score > 0.75
                        ? "#F59E0B"
                        : "#22D3EE",
                }}
              >
                {m.score.toFixed(2)}
              </span>
            </motion.div>
          ))}
        </div>
      </ChartEntrance>
    </ChartPanel>
  );
}

/* ── Charts section ──────────────────────────────────────── */
export default function OverviewCharts() {
  return (
    <motion.div
      variants={staggerNormal}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      {/* Section heading */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
        <h2 className="fe-section-heading">Analytics Overview</h2>
      </motion.div>

      {/* Grid: 3 cols on xl, 2 on md, 1 on mobile */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {/* Fraud trend spans 2 cols */}
        <div className="md:col-span-2">
          <FraudTrendChart />
        </div>
        <RiskDistChart />
        <HourlyChart />
        <div className="md:col-span-1">
          <RiskyMerchantsChart />
        </div>
      </motion.div>
    </motion.div>
  );
}
