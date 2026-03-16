/**
 * PageShell.jsx — Placeholder shell for pages not yet built
 *
 * Used in App.jsx as a temporary route target.
 * Replace each instance with the real page component in later phases.
 *
 * Also exports reusable layout helpers:
 *   PageWrapper   — outer page frame with padding
 *   PageSection   — section with consistent vertical spacing
 *   ContentGrid   — responsive CSS grid for card layouts
 *   SectionHeading — standard section label
 */

import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';
import { cn } from '../../utils/cn';

/* ============================================================
   REUSABLE LAYOUT HELPERS
   Import these in any page for consistent framing.
   ============================================================ */

/**
 * PageWrapper — the outermost container for every page.
 * Provides horizontal padding, max-width centering, and top/bottom breathing room.
 *
 * Usage:  <PageWrapper>  ...page content...  </PageWrapper>
 */
export function PageWrapper({ children, className = '' }) {
  return (
    <div className={cn(
      'w-full min-h-full',
      'px-5 md:px-6 lg:px-8',
      'pt-6 pb-12',
      'max-w-[1600px] mx-auto',
      className,
    )}>
      {children}
    </div>
  );
}

/**
 * PageHeader — title block at top of page body (below topbar).
 * Optional when topbar already shows the title — use for pages
 * that need a richer header with actions.
 *
 * Usage:
 *   <PageHeader
 *     title="Transactions"
 *     sub="Full transaction history"
 *     actions={<button>...</button>}
 *   />
 */
export function PageHeader({ title, sub, actions, className = '' }) {
  return (
    <div className={cn(
      'flex items-start justify-between gap-4 mb-6',
      className,
    )}>
      <div>
        <h2 className="text-xl font-bold text-[#F8FAFC] leading-none">{title}</h2>
        {sub && (
          <p className="text-sm text-[#475569] mt-1.5 leading-none">{sub}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * PageSection — wraps a logical section of a page.
 * Adds a labeled heading and consistent bottom spacing.
 *
 * Usage:
 *   <PageSection label="Recent Transactions">
 *     ...table or cards...
 *   </PageSection>
 */
export function PageSection({ label, children, className = '', action = null }) {
  return (
    <section className={cn('mb-8', className)}>
      {label && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="fe-section-heading">{label}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/**
 * ContentGrid — responsive card grid.
 * Default: 1 col mobile → 2 cols md → 4 cols xl
 *
 * Variants: "kpi" (4-col KPI row), "cards" (3-col cards), "split" (2-col)
 *
 * Usage:  <ContentGrid variant="kpi">  <KPICard/>...  </ContentGrid>
 */
export function ContentGrid({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4',
    kpi:     'grid grid-cols-2 lg:grid-cols-4 gap-4',
    cards:   'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4',
    split:   'grid grid-cols-1 lg:grid-cols-2 gap-4',
    thirds:  'grid grid-cols-1 md:grid-cols-3 gap-4',
    full:    'flex flex-col gap-4',
  };

  return (
    <div className={cn(variants[variant] ?? variants.default, className)}>
      {children}
    </div>
  );
}

/**
 * SectionDivider — thin horizontal rule between major sections.
 */
export function SectionDivider({ className = '' }) {
  return <hr className={cn('border-t border-[#0F172A] my-6', className)} />;
}

/**
 * GlassCard — reusable fe-glass surface for any content block.
 * Accepts accent glow class: "fe-glow-cyan" | "fe-glow-violet" etc.
 *
 * Usage:  <GlassCard glow="fe-glow-cyan">...</GlassCard>
 */
export function GlassCard({ children, glow = '', className = '' }) {
  return (
    <div className={cn('fe-glass p-5', glow, className)}>
      {children}
    </div>
  );
}

/**
 * InlineLabel — tiny uppercase label used inside cards.
 */
export function InlineLabel({ children, className = '' }) {
  return (
    <p className={cn(
      'text-[10px] font-semibold uppercase tracking-widest text-[#334155]',
      className,
    )}>
      {children}
    </p>
  );
}

/* ============================================================
   PAGE SHELL PLACEHOLDER
   Temporary stand-in. Replace with real page in next phases.
   ============================================================ */
export default function PageShell({ title = 'Page' }) {
  return (
    <PageWrapper>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#22D3EE08] border border-[#22D3EE18]
                        flex items-center justify-center">
          <Construction size={28} className="text-[#334155]" strokeWidth={1} />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold fe-gradient-text mb-2">{title}</h2>
          <p className="text-sm text-[#334155]">
            This page will be built in the next phase.
          </p>
        </div>

        {/* Decorative rule */}
        <div className="flex items-center gap-3 text-[10px] text-[#1E293B] font-mono uppercase tracking-widest">
          <span className="w-16 h-px bg-[#1E293B]" />
          Phase 3+
          <span className="w-16 h-px bg-[#1E293B]" />
        </div>
      </motion.div>
    </PageWrapper>
  );
}