import { motion } from "framer-motion";
import { BarChart2, RefreshCw, AlertTriangle, Minus } from "lucide-react";
import { CHART_SIZES } from "./chartTheme";

// ─── States ───────────────────────────────────────────────────────────────────
const ChartLoading = ({ height }) => (
  <div className="flex items-center justify-center" style={{ height }}>
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-cyan-500 animate-spin" />
      </div>
      <span className="text-xs text-slate-600">Loading chart…</span>
    </div>
  </div>
);

const ChartEmpty = ({ height, message }) => (
  <div className="flex items-center justify-center" style={{ height }}>
    <div className="flex flex-col items-center gap-2">
      <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center">
        <Minus size={16} className="text-slate-600" />
      </div>
      <span className="text-xs text-slate-600">
        {message || "No data available"}
      </span>
    </div>
  </div>
);

const ChartError = ({ height, onRetry }) => (
  <div className="flex items-center justify-center" style={{ height }}>
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
        <AlertTriangle size={16} className="text-rose-400" />
      </div>
      <span className="text-xs text-slate-500">Failed to load chart data</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <RefreshCw size={11} /> Retry
        </button>
      )}
    </div>
  </div>
);

// ─── Legend dot ───────────────────────────────────────────────────────────────
const LegendDot = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <span
      className="w-2 h-2 rounded-full flex-shrink-0"
      style={{ backgroundColor: color }}
    />
    <span className="text-[11px] text-slate-500">{label}</span>
  </div>
);

// ─── Chart container ──────────────────────────────────────────────────────────
const ChartContainer = ({
  title,
  subtitle,
  size = "md",
  legend,
  action,
  loading,
  empty,
  error,
  onRetry,
  children,
  className = "",
  delay = 0,
}) => {
  const { height } = CHART_SIZES[size] || CHART_SIZES.md;

  const renderBody = () => {
    if (loading) return <ChartLoading height={height} />;
    if (error) return <ChartError height={height} onRetry={onRetry} />;
    if (empty) return <ChartEmpty height={height} />;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.1 }}
        style={{ height }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-slate-800/60">
          <div>
            {title && (
              <div className="flex items-center gap-2">
                <BarChart2 size={13} className="text-slate-600 flex-shrink-0" />
                <h4 className="text-sm font-bold text-slate-100">{title}</h4>
              </div>
            )}
            {subtitle && (
              <p className="text-[11px] text-slate-500 mt-0.5 ml-5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}

      {/* Legend */}
      {legend && !loading && !error && !empty && (
        <div className="flex flex-wrap gap-3 px-5 pt-3">
          {legend.map((item) => (
            <LegendDot key={item.label} {...item} />
          ))}
        </div>
      )}

      {/* Body */}
      <div className="px-4 py-3">{renderBody()}</div>
    </motion.div>
  );
};

export default ChartContainer;
