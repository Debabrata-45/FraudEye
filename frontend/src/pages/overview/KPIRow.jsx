/**
 * KPIRow.jsx — Primary KPI summary row
 * 6 cards: Total Txns, Fraud Detected, Under Review, Approved, Avg Risk, Model Accuracy
 */

import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Clock,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { TrendIndicator } from "../../components/ui/MetricCard";
import { AnimatedCounter } from "../../motion";
import { staggerNormal, fadeUp, EASING } from "../../motion";
import { cn } from "../../utils/cn";
import {
  MOCK_KPIS,
  SPARK_TOTAL,
  SPARK_FRAUD,
  SPARK_REVIEW,
  SPARK_APPROVED,
  SPARK_RISK,
} from "./overviewData";

/* ── Accent token map ────────────────────────────────────── */
const ACCENT = {
  cyan: {
    text: "#22D3EE",
    bg: "bg-[#22D3EE08]",
    border: "border-[#22D3EE20]",
    shadow: "hover:shadow-[0_0_24px_#22D3EE0F]",
  },
  danger: {
    text: "#F43F5E",
    bg: "bg-[#F43F5E08]",
    border: "border-[#F43F5E20]",
    shadow: "hover:shadow-[0_0_24px_#F43F5E0F]",
  },
  warning: {
    text: "#F59E0B",
    bg: "bg-[#F59E0B08]",
    border: "border-[#F59E0B20]",
    shadow: "hover:shadow-[0_0_24px_#F59E0B0F]",
  },
  success: {
    text: "#22C55E",
    bg: "bg-[#22C55E08]",
    border: "border-[#22C55E20]",
    shadow: "hover:shadow-[0_0_24px_#22C55E0F]",
  },
  violet: {
    text: "#8B5CF6",
    bg: "bg-[#8B5CF608]",
    border: "border-[#8B5CF620]",
    shadow: "hover:shadow-[0_0_24px_#8B5CF60F]",
  },
};

/* ── Mini sparkline ──────────────────────────────────────── */
function Spark({ data, color }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-10 w-full mt-3">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 1, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient
              id={`sg-${color.replace("#", "")}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor={color} stopOpacity={0.2} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#sg-${color.replace("#", "")})`}
            dot={false}
            activeDot={{ r: 2, fill: color, stroke: "none" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Single KPI card ─────────────────────────────────────── */
function KPICard({
  icon: _Icon,
  title,
  value,
  delta,
  deltaType,
  accent = "cyan",
  sparkData,
  stagger = 0,
}) {
  const a = ACCENT[accent] ?? ACCENT.cyan;

  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay: stagger * 0.07, duration: 0.3, ease: EASING.out }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className={cn(
        "relative flex flex-col p-5 rounded-xl border overflow-hidden",
        "bg-[#0D1627] transition-shadow duration-200 cursor-default",
        a.border,
        a.shadow,
      )}
    >
      {/* Corner glow blob */}
      <span
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{ background: a.text }}
      />

      {/* Row 1: title + icon */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#475569] leading-none">
          {title}
        </p>
        <span
          className="p-1.5 rounded-lg border flex-shrink-0"
          style={{ background: `${a.text}12`, borderColor: `${a.text}28` }}
        >
          <_Icon size={13} strokeWidth={1.5} style={{ color: a.text }} />
        </span>
      </div>

      {/* Row 2: value */}
      <AnimatedCounter
        value={value}
        color={a.text}
        className="text-[26px] font-bold tracking-tight leading-none mt-1"
      />

      {/* Row 3: delta */}
      {delta && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <TrendIndicator delta={delta} type={deltaType} size="xs" />
          <span className="text-[10px] text-[#334155]">vs yesterday</span>
        </div>
      )}

      {/* Sparkline */}
      {sparkData && <Spark data={sparkData} color={a.text} />}
    </motion.div>
  );
}

/* ── KPI Row ─────────────────────────────────────────────── */
export default function KPIRow() {
  const k = MOCK_KPIS;

  return (
    <motion.div
      variants={staggerNormal}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
    >
      <KPICard
        icon={Activity}
        title="Total Transactions"
        value={k.totalTransactions.value}
        delta={k.totalTransactions.delta}
        deltaType={k.totalTransactions.deltaType}
        accent="cyan"
        sparkData={SPARK_TOTAL}
        stagger={0}
      />
      <KPICard
        icon={AlertTriangle}
        title="Fraud Detected"
        value={k.fraudDetected.value}
        delta={k.fraudDetected.delta}
        deltaType={k.fraudDetected.deltaType}
        accent="danger"
        sparkData={SPARK_FRAUD}
        stagger={1}
      />
      <KPICard
        icon={Clock}
        title="Under Review"
        value={k.underReview.value}
        delta={k.underReview.delta}
        deltaType={k.underReview.deltaType}
        accent="warning"
        sparkData={SPARK_REVIEW}
        stagger={2}
      />
      <KPICard
        icon={ShieldCheck}
        title="Approved"
        value={k.approved.value}
        delta={k.approved.delta}
        deltaType={k.approved.deltaType}
        accent="success"
        sparkData={SPARK_APPROVED}
        stagger={3}
      />
      <KPICard
        icon={TrendingUp}
        title="Avg Risk Score"
        value={k.avgRiskScore.value}
        delta={k.avgRiskScore.delta}
        deltaType={k.avgRiskScore.deltaType}
        accent="violet"
        sparkData={SPARK_RISK}
        stagger={4}
      />
      <KPICard
        icon={BrainCircuit}
        title="Model Accuracy"
        value={k.modelAccuracy.value}
        delta={k.modelAccuracy.delta}
        deltaType={k.modelAccuracy.deltaType}
        accent="cyan"
        stagger={5}
      />
    </motion.div>
  );
}
