/**
 * KPICard.jsx — FraudEye Reusable KPI Card
 *
 * Usage:
 *   <KPICard
 *     title="Total Transactions"
 *     value="12,847"
 *     delta="+4.2%"
 *     deltaType="up"          // "up" | "down" | "neutral"
 *     icon={Activity}         // Lucide icon component
 *     accent="cyan"           // "cyan" | "violet" | "success" | "danger" | "warning"
 *     sparkData={[3,5,2,8,6,9,12]}  // optional mini sparkline
 *     loading={false}
 *   />
 */

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../../utils/cn';

/* ── Accent colour tokens ─────────────────────────────────── */
const ACCENT = {
  cyan:    { text: 'text-[#22D3EE]', bg: 'bg-[#22D3EE14]', border: 'border-[#22D3EE33]', glow: 'fe-glow-cyan',    spark: '#22D3EE' },
  violet:  { text: 'text-[#8B5CF6]', bg: 'bg-[#8B5CF614]', border: 'border-[#8B5CF633]', glow: 'fe-glow-violet',  spark: '#8B5CF6' },
  success: { text: 'text-[#22C55E]', bg: 'bg-[#22C55E14]', border: 'border-[#22C55E33]', glow: 'fe-glow-success', spark: '#22C55E' },
  danger:  { text: 'text-[#F43F5E]', bg: 'bg-[#F43F5E14]', border: 'border-[#F43F5E33]', glow: 'fe-glow-danger',  spark: '#F43F5E' },
  warning: { text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B14]', border: 'border-[#F59E0B33]', glow: 'fe-glow-warning', spark: '#F59E0B' },
};

/* ── Delta colour helper ──────────────────────────────────── */
const deltaStyle = {
  up:      { color: 'text-[#22C55E]', Icon: TrendingUp },
  down:    { color: 'text-[#F43F5E]', Icon: TrendingDown },
  neutral: { color: 'text-[#94A3B8]', Icon: Minus },
};

/* ── Mini custom tooltip for sparkline ───────────────────── */
const SparkTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="fe-tooltip">
      {payload[0].value}
    </div>
  );
};

/* ── Skeleton loader ─────────────────────────────────────── */
function KPICardSkeleton() {
  return (
    <div className="fe-glass fe-kpi-hover p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="fe-shimmer h-3 w-28 rounded-full" />
        <div className="fe-shimmer h-8 w-8 rounded-lg" />
      </div>
      <div className="fe-shimmer h-7 w-24 rounded-full" />
      <div className="fe-shimmer h-3 w-16 rounded-full" />
      <div className="fe-shimmer h-10 w-full rounded-lg" />
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export default function KPICard({
  title       = 'Metric',
  value       = '—',
  delta       = null,
  deltaType   = 'neutral',   // "up" | "down" | "neutral"
  icon: Icon  = null,
  accent      = 'cyan',
  sparkData   = null,        // array of numbers  e.g. [3,7,5,9,6,12,10]
  loading     = false,
  className   = '',
  onClick     = null,
}) {
  if (loading) return <KPICardSkeleton />;

  const a = ACCENT[accent] ?? ACCENT.cyan;
  const d = deltaStyle[deltaType] ?? deltaStyle.neutral;
  const DeltaIcon = d.Icon;

  // Normalise sparkline data for recharts
  const chartData = sparkData?.map((v, i) => ({ i, v })) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onClick}
      className={cn(
        'fe-glass fe-kpi-hover p-5 flex flex-col gap-1 relative overflow-hidden',
        onClick && 'cursor-pointer',
        a.border,
        className,
      )}
    >
      {/* Subtle top-left accent glow */}
      <span
        className="pointer-events-none absolute -top-6 -left-6 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ background: a.spark }}
        aria-hidden="true"
      />

      {/* ── Row 1: title + icon ─────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wider text-[#94A3B8] leading-tight">
          {title}
        </p>
        {Icon && (
          <span className={cn('flex-shrink-0 p-1.5 rounded-lg', a.bg, a.border, 'border')}>
            <Icon size={14} className={a.text} />
          </span>
        )}
      </div>

      {/* ── Row 2: value ────────────────────────────────── */}
      <motion.p
        key={value}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
        className={cn('text-2xl font-bold tracking-tight mt-1', a.text)}
      >
        {value}
      </motion.p>

      {/* ── Row 3: delta ────────────────────────────────── */}
      {delta !== null && (
        <div className={cn('flex items-center gap-1 text-xs font-medium', d.color)}>
          <DeltaIcon size={12} />
          <span>{delta}</span>
          <span className="text-[#475569] font-normal">vs last period</span>
        </div>
      )}

      {/* ── Row 4: sparkline ────────────────────────────── */}
      {chartData.length > 0 && (
        <div className="mt-3 h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-grad-${accent}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={a.spark} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={a.spark} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip content={<SparkTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="v"
                stroke={a.spark}
                strokeWidth={1.5}
                fill={`url(#spark-grad-${accent})`}
                dot={false}
                activeDot={{ r: 3, fill: a.spark, stroke: 'none' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}