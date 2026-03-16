import { motion } from "framer-motion";
import ChartContainer from "./ChartContainer";
import { CHART_COLORS } from "./chartTheme";

const MERCHANTS = [
  {
    name: "Coinbase Exchange",
    category: "Crypto",
    score: 87,
    count: 43,
    icon: "₿",
  },
  {
    name: "Binance Global",
    category: "Crypto",
    score: 82,
    count: 38,
    icon: "🔶",
  },
  { name: "FTX Trading", category: "Crypto", score: 76, count: 29, icon: "📈" },
  {
    name: "Wise Transfers",
    category: "Remittance",
    score: 68,
    count: 24,
    icon: "🌍",
  },
  {
    name: "Unknown Merchant",
    category: "Unknown",
    score: 64,
    count: 19,
    icon: "❓",
  },
  {
    name: "Revolut Ltd",
    category: "Neobank",
    score: 52,
    count: 14,
    icon: "🔷",
  },
];

const getRiskColor = (score) => {
  if (score >= 80) return CHART_COLORS.fraud;
  if (score >= 65) return CHART_COLORS.orange;
  if (score >= 50) return CHART_COLORS.suspicious;
  return CHART_COLORS.cyan;
};

const MerchantRow = ({ merchant, index, maxScore }) => {
  const color = getRiskColor(merchant.score);
  const pct = (merchant.score / maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index }}
      className="flex items-center gap-3 py-2 group"
    >
      {/* Rank */}
      <span className="text-[10px] text-slate-600 tabular-nums w-4 text-right flex-shrink-0">
        {index + 1}
      </span>

      {/* Icon */}
      <span className="text-base leading-none flex-shrink-0">
        {merchant.icon}
      </span>

      {/* Name + bar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-slate-200 truncate">
            {merchant.name}
          </span>
          <span
            className="text-[11px] font-bold tabular-nums ml-2 flex-shrink-0"
            style={{ color }}
          >
            {merchant.score}
          </span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{
              duration: 0.6,
              delay: 0.1 + 0.05 * index,
              ease: "easeOut",
            }}
            className="h-full rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}60` }}
          />
        </div>
      </div>

      {/* Count */}
      <span className="text-[10px] text-slate-500 tabular-nums flex-shrink-0 w-8 text-right">
        {merchant.count}
      </span>
    </motion.div>
  );
};

const MerchantRiskChart = ({ size = "lg", delay = 0 }) => {
  const maxScore = Math.max(...MERCHANTS.map((m) => m.score));

  return (
    <ChartContainer
      title="Top Risk Merchants"
      subtitle="Ranked by average fraud risk score"
      size={size}
      delay={delay}
      action={
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <span>Score</span>
          <span className="mx-1 text-slate-700">·</span>
          <span>Flags</span>
        </div>
      }
    >
      <div className="space-y-0.5">
        {MERCHANTS.map((m, i) => (
          <MerchantRow
            key={m.name}
            merchant={m}
            index={i}
            maxScore={maxScore}
          />
        ))}
      </div>
    </ChartContainer>
  );
};

export default MerchantRiskChart;
