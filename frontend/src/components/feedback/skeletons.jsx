/**
 * skeletons.jsx — FraudEye Premium Skeleton Loaders
 *
 * Imports: import { TableSkeleton, ChartSkeleton, ... } from '../components/feedback'
 *
 * All shimmer uses fe-shimmer CSS class (left-to-right sweep on dark surface).
 * No Math.random() — all widths are static lookup arrays.
 */

import { motion } from "framer-motion";
import { cn } from "../../utils/cn";

/* ── Base shimmer block ──────────────────────────────────── */
function S({ className = "", style }) {
  return (
    <div className={cn("fe-shimmer rounded-md", className)} style={style} />
  );
}

/* ── Fade-in wrapper ─────────────────────────────────────── */
function FadeIn({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   PRIMITIVE SKELETONS
   ════════════════════════════════════════════════════════════ */

export function SkeletonLine({
  width = "w-full",
  height = "h-3",
  className = "",
}) {
  return <S className={cn(height, width, "rounded-full", className)} />;
}

export function SkeletonBlock({ className = "" }) {
  return <S className={cn("rounded-xl", className)} />;
}

/* ════════════════════════════════════════════════════════════
   COMPONENT SKELETONS
   ════════════════════════════════════════════════════════════ */

/* ── StatCardSkeleton ── */
export function StatCardSkeleton({ className = "" }) {
  return (
    <FadeIn
      className={cn(
        "bg-[#0D1627] border border-[#1E293B] rounded-xl p-5",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <S className="h-2.5 w-24 rounded-full" />
        <S className="h-7 w-7 rounded-lg" />
      </div>
      <S className="h-8 w-20 rounded-lg mb-2" />
      <S className="h-2 w-16 rounded-full mb-3" />
      <S className="h-10 w-full rounded-lg" />
    </FadeIn>
  );
}

/* ── KPIRowSkeleton ── */
export function KPIRowSkeleton({ count = 6, className = "" }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* ── TableRowSkeleton ── */
const ROW_W = ["75%", "55%", "85%", "60%", "70%", "45%", "80%", "65%"];

export function TableRowSkeleton({ cols = 6 }) {
  return (
    <tr className="border-l-2 border-l-transparent border-b border-b-[#0A1628]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <S
            className="h-3 rounded-full"
            style={{ width: ROW_W[i % ROW_W.length] }}
          />
        </td>
      ))}
    </tr>
  );
}

/* ── TableSkeleton ── */
export function TableSkeleton({ rows = 8, cols = 6, className = "" }) {
  return (
    <FadeIn
      className={cn(
        "w-full overflow-hidden rounded-xl border border-[#1E293B] bg-[#080F1A]",
        className,
      )}
    >
      <div className="flex items-center gap-4 px-4 py-3 bg-[#0A1220] border-b border-[#0F172A]">
        {Array.from({ length: cols }).map((_, i) => (
          <S key={i} className="h-2.5 rounded-full flex-1" />
        ))}
      </div>
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </FadeIn>
  );
}

/* ── AlertItemSkeleton ── */
export function AlertItemSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3.5 border-l-2 border-l-[#1E293B] border-b border-b-[#0A1628]">
      <S className="w-4 h-4 rounded-full flex-shrink-0 mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <S className="h-3 rounded-full w-2/3" />
          <S className="h-4 w-14 rounded-md flex-shrink-0" />
        </div>
        <S className="h-2.5 rounded-full w-4/5" />
        <div className="flex items-center gap-2">
          <S className="h-4 w-14 rounded-md" />
          <S className="h-4 w-12 rounded-md" />
          <S className="h-2 w-16 rounded-full ml-auto" />
        </div>
      </div>
    </div>
  );
}

/* ── AlertFeedSkeleton ── */
export function AlertFeedSkeleton({ count = 5, className = "" }) {
  return (
    <FadeIn
      className={cn(
        "overflow-hidden rounded-xl border border-[#1E293B] bg-[#080F1A]",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <AlertItemSkeleton key={i} />
      ))}
    </FadeIn>
  );
}

/* ── ChartSkeleton ── */
const BARS = [60, 80, 45, 90, 70, 55, 85, 65, 75, 50, 88, 72, 95, 68];

export function ChartSkeleton({ height = 220, className = "" }) {
  return (
    <FadeIn
      className={cn(
        "bg-[#0D1627] border border-[#1E293B] rounded-xl overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#0F172A]">
        <div className="flex items-center gap-2">
          <S className="h-5 w-5 rounded-md" />
          <S className="h-3 w-32 rounded-full" />
        </div>
        <S className="h-3 w-16 rounded-full" />
      </div>
      <div className="p-5">
        <div className="relative overflow-hidden" style={{ height }}>
          <div className="absolute bottom-0 left-0 right-0 flex items-end gap-1 px-2">
            {BARS.map((h, i) => (
              <S
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ height: `${h}%`, opacity: 0.3 + (i % 3) * 0.15 }}
              />
            ))}
          </div>
        </div>
      </div>
    </FadeIn>
  );
}

/* ── DetailPanelSkeleton ── */
export function DetailPanelSkeleton({ className = "" }) {
  return (
    <FadeIn
      className={cn(
        "bg-[#080F1A] border border-[#1E293B] rounded-xl overflow-hidden flex flex-col",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-[#0A1220] border-b border-[#0F172A] flex-shrink-0">
        <div className="flex items-center gap-2">
          <S className="h-5 w-5 rounded-md" />
          <S className="h-3 w-28 rounded-full" />
        </div>
        <S className="h-5 w-5 rounded-md" />
      </div>
      <div className="p-4 space-y-5 flex-1">
        <div className="flex items-center gap-4 p-3.5 rounded-xl border border-[#1E293B]">
          <S className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <S className="h-3 w-32 rounded-full" />
            <S className="h-2.5 w-48 rounded-full" />
            <S className="h-2.5 w-20 rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <S className="h-2.5 w-24 rounded-full" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-1.5">
              <S className="h-2.5 w-20 rounded-full" />
              <S className="h-2.5 w-28 rounded-full" />
            </div>
          ))}
        </div>
        <div className="space-y-2.5">
          <S className="h-2.5 w-28 rounded-full" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <S className="h-2.5 w-20 rounded-full flex-shrink-0" />
              <S className="h-1.5 flex-1 rounded-full" />
              <S className="h-2.5 w-10 rounded-full flex-shrink-0" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <S key={i} className="flex-1 h-8 rounded-lg" />
          ))}
        </div>
      </div>
    </FadeIn>
  );
}

/* ── ExplanationSkeleton ── */
export function ExplanationSkeleton({ className = "" }) {
  return (
    <FadeIn className={cn("space-y-5", className)}>
      <div className="flex items-center gap-4 p-4 rounded-xl border border-[#1E293B]">
        <S className="w-14 h-14 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <S className="h-3 w-28 rounded-full" />
            <S className="h-4 w-12 rounded-md" />
          </div>
          <S className="h-2.5 w-40 rounded-full" />
          <div className="flex gap-1.5">
            {Array.from({ length: 3 }).map((_, i) => (
              <S key={i} className="h-4 w-20 rounded-md" />
            ))}
          </div>
        </div>
        <S className="w-14 h-14 rounded-full flex-shrink-0" />
      </div>
      <div className="space-y-3">
        <S className="h-2.5 w-36 rounded-full" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <S className="h-2.5 w-4 rounded-full flex-shrink-0" />
            <S className="h-2.5 w-32 rounded-full flex-shrink-0" />
            <S
              className="h-2 flex-1 rounded-full"
              style={{ maxWidth: `${40 + (i % 4) * 15}%` }}
            />
            <S className="h-2.5 w-12 rounded-full flex-shrink-0" />
          </div>
        ))}
      </div>
      <S className="h-14 w-full rounded-xl" />
    </FadeIn>
  );
}

/* ── SettingsFormSkeleton ── */
export function SettingsFormSkeleton({ rows = 5, className = "" }) {
  return (
    <FadeIn
      className={cn(
        "bg-[#0D1627] border border-[#1E293B] rounded-xl overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#0F172A]">
        <S className="h-5 w-5 rounded-md" />
        <S className="h-3 w-32 rounded-full" />
      </div>
      <div className="p-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-3.5 border-b border-[#0F172A] last:border-0"
          >
            <div className="space-y-1.5">
              <S className="h-3 w-28 rounded-full" />
              <S className="h-2.5 w-44 rounded-full" />
            </div>
            <S className="h-7 w-12 rounded-lg flex-shrink-0 ml-4" />
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

/* ════════════════════════════════════════════════════════════
   PAGE-LEVEL SKELETONS
   variant: 'default' | 'table' | 'split' | 'dashboard' | 'three-col' | 'explanation'
   ════════════════════════════════════════════════════════════ */

const WRAP =
  "w-full px-5 md:px-6 lg:px-8 pt-6 pb-12 max-w-[1600px] mx-auto space-y-6";

function PageHeader() {
  return (
    <div className="space-y-2 mb-6">
      <S className="h-7 w-48 rounded-lg" />
      <S className="h-3 w-72 rounded-full" />
    </div>
  );
}

export function PageSkeleton({ variant = "default" }) {
  if (variant === "table") {
    return (
      <div className={WRAP}>
        <PageHeader />
        <div className="flex items-center gap-3 mb-4">
          <S className="h-9 flex-1 max-w-xs rounded-lg" />
          <S className="h-9 w-32 rounded-lg" />
          <S className="h-9 w-28 rounded-lg" />
          <S className="h-9 w-8 rounded-lg ml-auto" />
        </div>
        <TableSkeleton rows={10} />
      </div>
    );
  }

  if (variant === "split") {
    return (
      <div className={WRAP}>
        <PageHeader />
        <div className="grid grid-cols-3 gap-4 h-[560px]">
          <div className="col-span-2">
            <AlertFeedSkeleton count={7} className="h-full" />
          </div>
          <DetailPanelSkeleton className="h-full" />
        </div>
      </div>
    );
  }

  if (variant === "dashboard") {
    return (
      <div className={WRAP}>
        <PageHeader />
        <KPIRowSkeleton />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ChartSkeleton className="md:col-span-2" height={200} />
          <ChartSkeleton height={200} />
          <ChartSkeleton height={180} />
          <ChartSkeleton height={180} />
        </div>
      </div>
    );
  }

  if (variant === "three-col") {
    return (
      <div className={WRAP}>
        <PageHeader />
        <div className="grid grid-cols-3 gap-4 h-[560px]">
          <AlertFeedSkeleton count={6} className="h-full" />
          <DetailPanelSkeleton className="h-full" />
          <SettingsFormSkeleton rows={6} className="h-full" />
        </div>
      </div>
    );
  }

  if (variant === "explanation") {
    return (
      <div className={WRAP}>
        <PageHeader />
        <div className="grid grid-cols-4 gap-4 h-[560px]">
          <AlertFeedSkeleton count={8} className="h-full" />
          <div className="col-span-3">
            <ExplanationSkeleton />
          </div>
        </div>
      </div>
    );
  }

  // default
  return (
    <div className={WRAP}>
      <PageHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AlertFeedSkeleton count={5} className="lg:col-span-2" />
        <DetailPanelSkeleton />
      </div>
    </div>
  );
}
