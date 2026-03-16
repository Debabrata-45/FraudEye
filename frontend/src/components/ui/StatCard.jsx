/**
 * StatCard.jsx — FraudEye Compact Stat Card
 *
 * Lighter-weight sibling to KPICard. Used for secondary/supporting metrics.
 *
 * Usage:
 *   <StatCard
 *     label="Avg Risk Score"
 *     value="0.74"
 *     sub="last 24h"
 *     badge="HIGH"
 *     badgeColor="danger"
 *     icon={Zap}
 *   />
 */

import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const BADGE_COLORS = {
  cyan:    'bg-[#22D3EE18] text-[#22D3EE] border-[#22D3EE33]',
  violet:  'bg-[#8B5CF618] text-[#8B5CF6] border-[#8B5CF633]',
  success: 'bg-[#22C55E18] text-[#22C55E] border-[#22C55E33]',
  danger:  'bg-[#F43F5E18] text-[#F43F5E] border-[#F43F5E33]',
  warning: 'bg-[#F59E0B18] text-[#F59E0B] border-[#F59E0B33]',
  muted:   'bg-[#33415518] text-[#94A3B8] border-[#33415533]',
};

export default function StatCard({
  label       = 'Metric',
  value       = '—',
  sub         = null,
  badge       = null,
  badgeColor  = 'muted',
  icon: Icon  = null,
  loading     = false,
  className   = '',
  staggerIndex = 0,
}) {
  if (loading) {
    return (
      <div className={cn('fe-glass-light p-4 flex items-center gap-3', className)}>
        <div className="fe-shimmer h-8 w-8 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="fe-shimmer h-2.5 w-20 rounded-full" />
          <div className="fe-shimmer h-4 w-14 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: staggerIndex * 0.05, ease: 'easeOut' }}
      className={cn(
        'fe-glass-light p-4 flex items-center gap-3 group',
        'hover:border-[#475569] transition-colors duration-200',
        className,
      )}
    >
      {/* Icon */}
      {Icon && (
        <div className="flex-shrink-0 p-2 rounded-lg bg-[#0F172A] border border-[#334155] group-hover:border-[#475569] transition-colors">
          <Icon size={16} className="text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors" />
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-[#475569] font-medium leading-none mb-1">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-[#F8FAFC] tabular-nums leading-none">
            {value}
          </span>
          {sub && (
            <span className="text-[11px] text-[#475569] truncate">{sub}</span>
          )}
        </div>
      </div>

      {/* Badge */}
      {badge && (
        <span className={cn(
          'fe-badge border flex-shrink-0',
          BADGE_COLORS[badgeColor] ?? BADGE_COLORS.muted,
        )}>
          {badge}
        </span>
      )}
    </motion.div>
  );
}