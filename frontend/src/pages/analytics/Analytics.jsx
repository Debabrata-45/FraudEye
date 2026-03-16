import { useState, useEffect } from "react";
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
import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  CheckCircle,
  Clock,
} from "lucide-react";
import { API_BASE_URL, CHART_COLORS } from "../../utils/constants";
import { cn } from "../../utils/cn";
import { motionVariants } from "../../styles/tokens";

// ─── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="fe-glass rounded-fe border border-fe-border px-3 py-2 text-xs shadow-lg">
      {label && <p className="text-fe-text-3 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────
function MetricCard({ value, _title, color, _delta }) {
  //                          ↑ underscore, then comma, rest unchanged
  return (
    <motion.div
      variants={motionVariants.fadeUp}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn("fe-glass rounded-fe-xl p-5 border transition-all", glow)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-fe flex items-center justify-center",
            color.bg,
          )}
        >
          <Icon className={cn("w-4 h-4", color.text)} />
        </div>
      </div>
      <p className="text-3xl font-bold text-fe-text mb-1">{value ?? "—"}</p>
      <p className="text-fe-text-2 text-sm font-medium">{label}</p>
      {sub && <p className="text-fe-text-3 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

// ─── Chart Container ──────────────────────────────────────────
function ChartCard({ title, subtitle, children }) {
  return (
    <motion.div
      variants={motionVariants.fadeUp}
      className="fe-glass rounded-fe-xl p-5 border border-fe-border"
    >
      <div className="mb-4">
        <h3 className="text-fe-text font-semibold text-sm fe-section-heading">
          {title}
        </h3>
        {subtitle && (
          <p className="text-fe-text-3 text-xs mt-1 ml-3">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export default function Analytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("fraudeye_token");
    fetch(`${API_BASE_URL}/api/analytics/summary`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        setSummary(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Build chart data from summary
  const riskData =
    summary?.byRiskLabel?.map((r) => ({
      name: r.label.charAt(0).toUpperCase() + r.label.slice(1),
      count: r.count,
      fill:
        r.label === "high" || r.label === "critical"
          ? CHART_COLORS.fraud
          : r.label === "medium"
            ? CHART_COLORS.medium
            : r.label === "low"
              ? CHART_COLORS.safe
              : CHART_COLORS.violet,
    })) || [];

  const pieData = riskData.filter((r) => r.count > 0);

  // Mock trend data (replace with real API when available)
  const trendData = [
    { time: "00:00", fraud: 2, safe: 18 },
    { time: "04:00", fraud: 1, safe: 12 },
    { time: "08:00", fraud: 5, safe: 32 },
    { time: "12:00", fraud: 8, safe: 45 },
    { time: "16:00", fraud: 6, safe: 38 },
    { time: "20:00", fraud: 4, safe: 28 },
    { time: "23:59", fraud: 3, safe: 20 },
  ];

  const scoreDist = [
    { range: "0-10", count: 28 },
    { range: "11-30", count: 15 },
    { range: "31-50", count: 8 },
    { range: "51-70", count: 5 },
    { range: "71-90", count: 3 },
    { range: "91-100", count: 2 },
  ];

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="fe-glass rounded-fe-xl p-5 border border-fe-border h-28 fe-shimmer"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="fe-glass rounded-fe-xl p-5 border border-fe-border h-64 fe-shimmer"
            />
          ))}
        </div>
      </div>
    );
  }

  const fraudCount =
    summary?.byRiskLabel?.find(
      (r) => r.label === "high" || r.label === "critical",
    )?.count || 0;

  return (
    <motion.div
      variants={motionVariants.stagger}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={motionVariants.fadeUp}>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="w-5 h-5 text-fe-cyan" />
          <h1 className="text-xl font-bold text-fe-text">Analytics</h1>
        </div>
        <p className="text-fe-text-3 text-sm">
          Fraud intelligence overview and trends
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Transactions"
          value={summary?.totalTransactions?.toLocaleString()}
          sub="All time"
          color={{ bg: "bg-fe-cyan/10", text: "text-fe-cyan" }}
          glow="border-fe-border fe-glow-cyan"
        />
        <StatCard
          icon={ShieldAlert}
          label="High Risk"
          value={fraudCount}
          sub="Flagged transactions"
          color={{ bg: "bg-rose-500/10", text: "text-rose-400" }}
          glow="border-fe-border fe-glow-danger"
        />
        <StatCard
          icon={Clock}
          label="Avg Risk Score"
          value={summary?.avgRiskScore?.toFixed(1)}
          sub="Across all transactions"
          color={{ bg: "bg-amber-500/10", text: "text-amber-400" }}
          glow="border-fe-border fe-glow-warning"
        />
        <StatCard
          icon={CheckCircle}
          label="Low Risk"
          value={
            summary?.byRiskLabel?.find((r) => r.label === "low")?.count || 0
          }
          sub="Safe transactions"
          color={{ bg: "bg-emerald-500/10", text: "text-emerald-400" }}
          glow="border-fe-border fe-glow-success"
        />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Fraud trend */}
        <ChartCard
          title="Transaction Activity"
          subtitle="Fraud vs safe over time"
        >
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.fraud}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.fraud}
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="safeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_COLORS.safe}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_COLORS.safe}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="time"
                stroke={CHART_COLORS.tooltip}
                tick={{ fill: "#475569", fontSize: 11 }}
              />
              <YAxis
                stroke={CHART_COLORS.tooltip}
                tick={{ fill: "#475569", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }} />
              <Area
                type="monotone"
                dataKey="fraud"
                stroke={CHART_COLORS.fraud}
                fill="url(#fraudGrad)"
                strokeWidth={2}
                name="Fraud"
              />
              <Area
                type="monotone"
                dataKey="safe"
                stroke={CHART_COLORS.safe}
                fill="url(#safeGrad)"
                strokeWidth={2}
                name="Safe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk distribution pie */}
        <ChartCard title="Risk Distribution" subtitle="Breakdown by risk label">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: "12px", color: "#94A3B8" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-fe-text-3 text-sm">
              No scored transactions yet
            </div>
          )}
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk label bar chart */}
        <ChartCard
          title="Transactions by Risk Label"
          subtitle="Count per category"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={riskData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="name"
                stroke={CHART_COLORS.tooltip}
                tick={{ fill: "#475569", fontSize: 11 }}
              />
              <YAxis
                stroke={CHART_COLORS.tooltip}
                tick={{ fill: "#475569", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Transactions" radius={[4, 4, 0, 0]}>
                {riskData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Score distribution */}
        <ChartCard
          title="Risk Score Distribution"
          subtitle="Frequency by score range"
        >
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={scoreDist} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="range"
                stroke={CHART_COLORS.tooltip}
                tick={{ fill: "#475569", fontSize: 11 }}
              />
              <YAxis
                stroke={CHART_COLORS.tooltip}
                tick={{ fill: "#475569", fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Count"
                fill={CHART_COLORS.cyan}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </motion.div>
  );
}
