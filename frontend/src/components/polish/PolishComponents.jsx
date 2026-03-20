/**
 * PolishComponents.jsx — FraudEye Phase 15 Drop-in Polish Components
 *
 * Lightweight components that apply premium identity touches.
 * All are self-contained — no external deps beyond framer-motion.
 *
 * Exports:
 *   BrandLogo          — sidebar/topbar logo lockup with glow
 *   LiveBadge          — polished live status badge
 *   ScanFrame          — wraps a container with fe-scan-line effect
 *   HeroLine           — decorative separator under page heroes
 *   ElitePanel         — top-edge lit panel wrapper
 *   CriticalPulseRing  — pulsing ring for critical fraud items
 *   GradientHeading    — gradient-text section heading
 *   PremiumButton      — primary CTA with shine sweep
 *   SystemStatusDot    — system health indicator with color coding
 */

import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { cn } from '../../utils/cn';

/* ── BrandLogo ───────────────────────────────────────────── */
/**
 * Use in Sidebar.jsx header area.
 * Replaces or wraps the existing logo text.
 */
export function BrandLogo({ collapsed = false, className = '' }) {
  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      {/* Shield icon with glow */}
      <div className="relative flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-[#22D3EE14] border border-[#22D3EE28]
                         flex items-center justify-center"
             style={{ boxShadow: '0 0 14px rgba(34,211,238,0.18)' }}>
          <ShieldAlert size={16} strokeWidth={1.5} className="text-[#22D3EE]" />
        </div>
        {/* Micro live pulse dot */}
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#22C55E]
                          border border-[#020617]"
              style={{ boxShadow: '0 0 6px rgba(34,197,94,0.7)' }} />
      </div>

      {/* Wordmark */}
      {!collapsed && (
        <div className="relative fe-logo-accent">
          <span className="fe-logo-glow text-[15px] font-bold tracking-tight leading-none"
                style={{
                  background: 'linear-gradient(130deg, #22D3EE 0%, #A78BFA 60%, #8B5CF6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
            FraudEye
          </span>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em]
                            text-[#334155] mt-0.5 leading-none">
            AI Fraud Intelligence
          </span>
        </div>
      )}
    </div>
  );
}

/* ── LiveBadge ───────────────────────────────────────────── */
/**
 * Premium live status badge with two-ring pulse.
 * variant: 'active' | 'paused' | 'disconnected'
 */
export function LiveBadge({ variant = 'active', label, className = '' }) {
  const configs = {
    active:       { dot: '#22C55E', text: 'text-[#22C55E]', bg: 'bg-[#22C55E0A]', border: 'border-[#22C55E33]', pulse: true  },
    paused:       { dot: '#64748B', text: 'text-[#64748B]', bg: 'bg-[#47556914]', border: 'border-[#33415533]', pulse: false },
    disconnected: { dot: '#F59E0B', text: 'text-[#F59E0B]', bg: 'bg-[#F59E0B0A]', border: 'border-[#F59E0B33]', pulse: true  },
  };
  const c = configs[variant] ?? configs.active;
  const defaultLabels = { active: 'Live', paused: 'Paused', disconnected: 'Reconnecting' };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold',
      c.bg, c.border, c.text, className,
    )}>
      {/* Two-ring dot */}
      <span className="relative flex-shrink-0 w-2 h-2">
        <span
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: c.dot }}
        />
        {c.pulse && (
          <motion.span
            className="absolute rounded-full"
            style={{ inset: -3, backgroundColor: c.dot, opacity: 0.3 }}
            animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </span>
      {label ?? defaultLabels[variant]}
    </span>
  );
}

/* ── ScanFrame ───────────────────────────────────────────── */
/**
 * Wraps children with the scan-line effect.
 * Use ONLY on: ThreatFeed outer container in LiveMonitoring.
 */
export function ScanFrame({ children, className = '' }) {
  return (
    <div className={cn('fe-scan-line', className)}>
      {children}
    </div>
  );
}

/* ── HeroLine ────────────────────────────────────────────── */
/**
 * Decorative gradient separator — use under page hero headings.
 * Replaces the plain border-b used in OverviewHero, LiveHeader, etc.
 */
export function HeroLine({ className = '' }) {
  return (
    <motion.div
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0, 0, 0.2, 1], delay: 0.25 }}
      style={{ originX: 0 }}
      className={cn('fe-hero-line mt-4', className)}
    />
  );
}

/* ── ElitePanel ──────────────────────────────────────────── */
/**
 * Premium panel wrapper with top-edge lighting.
 * Use on: XAI explanation panel, SpotlightPanel, TransactionDrawer.
 */
export function ElitePanel({ children, className = '' }) {
  return (
    <div className={cn('fe-panel-elite rounded-xl overflow-hidden', className)}>
      {children}
    </div>
  );
}

/* ── CriticalPulseRing ───────────────────────────────────── */
/**
 * Pulsing red ring wrapper for critical fraud items.
 * Wraps the outer card container, not inner content.
 */
export function CriticalPulseRing({ children, active = true, className = '' }) {
  return (
    <div className={cn(
      'rounded-xl',
      active && 'fe-glow-critical fe-glow-critical-pulse',
      className,
    )}>
      {children}
    </div>
  );
}

/* ── GradientHeading ─────────────────────────────────────── */
/**
 * Section heading with left accent + optional gradient text.
 * Replaces the plain fe-section-heading text usage in JSX.
 */
export function GradientHeading({ children, gradient = false, className = '' }) {
  return (
    <h2 className={cn('fe-section-heading', className)}>
      {gradient ? (
        <span className="fe-gradient-text">{children}</span>
      ) : children}
    </h2>
  );
}

/* ── PremiumButton ───────────────────────────────────────── */
/**
 * Primary CTA button with shine sweep + hover lift.
 * Use for: primary save actions, main CTAs only.
 * Not for every button — reserve for the most important actions.
 */
export function PremiumButton({
  children,
  onClick,
  disabled = false,
  loading  = false,
  variant  = 'cyan',     // 'cyan' | 'violet' | 'danger'
  size     = 'md',
  className = '',
}) {
  const variants = {
    cyan:   'bg-[#22D3EE14] text-[#22D3EE] border-[#22D3EE33] hover:bg-[#22D3EE22] hover:border-[#22D3EE55]',
    violet: 'bg-[#8B5CF614] text-[#8B5CF6] border-[#8B5CF633] hover:bg-[#8B5CF622] hover:border-[#8B5CF655]',
    danger: 'bg-[#F43F5E14] text-[#F43F5E] border-[#F43F5E33] hover:bg-[#F43F5E22] hover:border-[#F43F5E55]',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-xs',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97, y: 0 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'fe-shine inline-flex items-center gap-1.5 rounded-lg border font-semibold',
        'transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant] ?? variants.cyan,
        sizes[size] ?? sizes.md,
        className,
      )}
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
          className="w-3 h-3 border border-current border-t-transparent rounded-full inline-block"
        />
      ) : null}
      {children}
    </motion.button>
  );
}

/* ── SystemStatusDot ─────────────────────────────────────── */
/**
 * System health dot — for topbar / settings system section.
 * status: 'ok' | 'warn' | 'error' | 'idle'
 */
export function SystemStatusDot({ status = 'ok', label, className = '' }) {
  const configs = {
    ok:    { color: '#22C55E', pulse: true  },
    warn:  { color: '#F59E0B', pulse: true  },
    error: { color: '#F43F5E', pulse: true  },
    idle:  { color: '#475569', pulse: false },
  };
  const c = configs[status] ?? configs.idle;

  return (
    <span className={cn('inline-flex items-center gap-1.5 text-[11px]', className)}
          style={{ color: c.color }}>
      <span className="relative flex-shrink-0 w-1.5 h-1.5">
        <span className="absolute inset-0 rounded-full" style={{ backgroundColor: c.color }} />
        {c.pulse && (
          <motion.span
            className="absolute rounded-full"
            style={{ inset: -2, backgroundColor: c.color, opacity: 0.25 }}
            animate={{ scale: [1, 2, 1], opacity: [0.25, 0, 0.25] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </span>
      {label}
    </span>
  );
}