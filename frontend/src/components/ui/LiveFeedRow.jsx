/**
 * LiveFeedRow.jsx — Animated Transaction Feed Row
 *
 * Drop this into TransactionsFeed.jsx as the <tr> replacement.
 * Handles:
 *   - Framer Motion staggered entry on mount
 *   - Flash highlight for brand-new SSE rows
 *   - Risk-level left border (high/medium/low)
 *   - Click to open TransactionDetail drawer
 *
 * Usage:
 *   {transactions.map((txn, i) => (
 *     <LiveFeedRow
 *       key={txn.id}
 *       txn={txn}
 *       index={i}
 *       isNew={newIds.has(txn.id)}
 *       onClick={() => setSelected(txn)}
 *     />
 *   ))}
 *
 * txn shape:
 *   { id, amount, currency, risk_score, label, merchant_name,
 *     card_last4, occurred_at, status }
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import RiskBadge from '../ui/RiskBadge';
import { formatDistanceToNow } from 'date-fns';

/* ── Helpers ─────────────────────────────────────────────── */
function fmtAmount(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function fmtTime(iso) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return '—';
  }
}

const RISK_BORDER = {
  HIGH:    'border-l-[#F43F5E]',
  MEDIUM:  'border-l-[#F59E0B]',
  LOW:     'border-l-[#22C55E]',
  UNKNOWN: 'border-l-[#334155]',
};

const RISK_SCORE_COLOR = (score) => {
  if (score >= 0.7) return 'text-[#F43F5E]';
  if (score >= 0.4) return 'text-[#F59E0B]';
  return 'text-[#22C55E]';
};

/* ── Row Variants ────────────────────────────────────────── */
const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.28,
      delay: Math.min(i * 0.04, 0.4),   // cap stagger at 400ms total
      ease: 'easeOut',
    },
  }),
  exit: {
    opacity: 0,
    x: 8,
    transition: { duration: 0.2 },
  },
};

/* ── Component ───────────────────────────────────────────── */
export default function LiveFeedRow({ txn, index = 0, isNew = false, onClick }) {
  const rowRef = useRef(null);
  const label  = txn.label?.toUpperCase() ?? 'UNKNOWN';
  const borderClass = RISK_BORDER[label] ?? RISK_BORDER.UNKNOWN;

  // Flash effect when a new SSE row arrives
  useEffect(() => {
    if (isNew && rowRef.current) {
      rowRef.current.classList.add('fe-row-flash');
      const timer = setTimeout(() => {
        rowRef.current?.classList.remove('fe-row-flash');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  return (
    <motion.tr
      ref={rowRef}
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      onClick={onClick}
      className={cn(
        'fe-table-row border-l-2',
        borderClass,
        'cursor-pointer',
      )}
    >
      {/* Transaction ID */}
      <td className="px-4 py-3 text-left">
        <span className="fe-mono text-[#94A3B8] text-[11px]">
          #{String(txn.id).slice(0, 8).toUpperCase()}
        </span>
      </td>

      {/* Merchant */}
      <td className="px-4 py-3 text-left">
        <span className="text-sm text-[#F8FAFC] font-medium truncate max-w-[140px] block">
          {txn.merchant_name ?? '—'}
        </span>
        {txn.card_last4 && (
          <span className="text-[11px] text-[#475569] fe-mono">
            ···· {txn.card_last4}
          </span>
        )}
      </td>

      {/* Amount */}
      <td className="px-4 py-3 text-right">
        <span className="text-sm font-semibold text-[#F8FAFC] tabular-nums">
          {fmtAmount(txn.amount, txn.currency)}
        </span>
      </td>

      {/* Risk Score */}
      <td className="px-4 py-3 text-center">
        {txn.risk_score != null ? (
          <span className={cn(
            'text-sm font-bold tabular-nums fe-mono',
            RISK_SCORE_COLOR(txn.risk_score),
          )}>
            {(txn.risk_score * 100).toFixed(1)}%
          </span>
        ) : (
          <span className="text-[#475569] text-xs">—</span>
        )}
      </td>

      {/* Label / Risk Badge */}
      <td className="px-4 py-3 text-center">
        <RiskBadge label={label} />
      </td>

      {/* Time */}
      <td className="px-4 py-3 text-right">
        <span className="text-[11px] text-[#475569]">
          {fmtTime(txn.occurred_at)}
        </span>
      </td>

      {/* Status dot */}
      <td className="px-4 py-3 text-center">
        {isNew ? (
          <span className="fe-live-dot" title="Just arrived" />
        ) : (
          <span className="inline-block w-2 h-2 rounded-full bg-[#334155]" />
        )}
      </td>
    </motion.tr>
  );
}