/**
 * Button.jsx — FraudEye Action System
 *
 * Exports:
 *   Button       — main polymorphic button (variant prop)
 *   IconButton   — square icon-only button
 *   ButtonGroup  — horizontal group of related buttons
 *
 * Variants:
 *   primary     — cyan accent, main CTA
 *   secondary   — violet accent, secondary action
 *   ghost       — neutral outline, tertiary action
 *   destructive — red, delete/flag/block actions
 *   success     — emerald, approve/mark-safe actions
 *   warning     — amber, review/escalate actions
 *   ai          — cyan-violet gradient, AI/explain actions
 *
 * Sizes: xs | sm | md (default) | lg
 *
 * States: disabled, loading (spinner replaces icon)
 *
 * Usage:
 *   <Button variant="primary" size="sm" onClick={fn}>Export</Button>
 *   <Button variant="destructive" loading>Flagging...</Button>
 *   <IconButton icon={Search} label="Search" />
 */

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

/* ── Variant styles ──────────────────────────────────────── */
const VARIANTS = {
  primary: cn(
    "bg-[#22D3EE14] text-[#22D3EE] border border-[#22D3EE33]",
    "hover:bg-[#22D3EE22] hover:border-[#22D3EE66] hover:shadow-[0_0_12px_#22D3EE18]",
    "focus-visible:ring-2 focus-visible:ring-[#22D3EE44]",
  ),
  secondary: cn(
    "bg-[#8B5CF614] text-[#8B5CF6] border border-[#8B5CF633]",
    "hover:bg-[#8B5CF622] hover:border-[#8B5CF666] hover:shadow-[0_0_12px_#8B5CF618]",
    "focus-visible:ring-2 focus-visible:ring-[#8B5CF644]",
  ),
  ghost: cn(
    "bg-transparent text-[#64748B] border border-[#1E293B]",
    "hover:text-[#CBD5E1] hover:border-[#334155] hover:bg-[#FFFFFF06]",
    "focus-visible:ring-2 focus-visible:ring-[#33415544]",
  ),
  destructive: cn(
    "bg-[#F43F5E14] text-[#F43F5E] border border-[#F43F5E33]",
    "hover:bg-[#F43F5E22] hover:border-[#F43F5E66] hover:shadow-[0_0_12px_#F43F5E18]",
    "focus-visible:ring-2 focus-visible:ring-[#F43F5E44]",
  ),
  success: cn(
    "bg-[#22C55E14] text-[#22C55E] border border-[#22C55E33]",
    "hover:bg-[#22C55E22] hover:border-[#22C55E66] hover:shadow-[0_0_12px_#22C55E18]",
    "focus-visible:ring-2 focus-visible:ring-[#22C55E44]",
  ),
  warning: cn(
    "bg-[#F59E0B14] text-[#F59E0B] border border-[#F59E0B33]",
    "hover:bg-[#F59E0B22] hover:border-[#F59E0B66] hover:shadow-[0_0_12px_#F59E0B18]",
    "focus-visible:ring-2 focus-visible:ring-[#F59E0B44]",
  ),
  ai: cn(
    "bg-gradient-to-r from-[#22D3EE14] to-[#8B5CF614]",
    "text-[#A78BFA] border border-[#8B5CF633]",
    "hover:from-[#22D3EE22] hover:to-[#8B5CF622] hover:border-[#8B5CF666]",
    "focus-visible:ring-2 focus-visible:ring-[#8B5CF644]",
  ),
};

/* ── Size styles ─────────────────────────────────────────── */
const SIZES = {
  xs: "h-6  px-2   text-[10px] gap-1   rounded-md",
  sm: "h-7  px-2.5 text-xs     gap-1.5 rounded-lg",
  md: "h-8  px-3   text-sm     gap-2   rounded-lg",
  lg: "h-10 px-4   text-sm     gap-2   rounded-xl",
};

/* ── Button ──────────────────────────────────────────────── */
export function Button({
  children,
  variant = "ghost",
  size = "md",
  icon: Icon,
  iconRight,
  loading = false,
  disabled = false,
  className = "",
  onClick,
  type = "button",
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      whileTap={isDisabled ? undefined : { scale: 0.97 }}
      className={cn(
        "inline-flex items-center justify-center font-medium",
        "transition-all duration-150 outline-none select-none",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        VARIANTS[variant] ?? VARIANTS.ghost,
        SIZES[size] ?? SIZES.md,
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin flex-shrink-0" />
      ) : Icon ? (
        <Icon
          size={size === "xs" ? 10 : size === "sm" ? 12 : 14}
          className="flex-shrink-0"
          strokeWidth={1.5}
        />
      ) : null}

      {children && <span className="truncate">{children}</span>}

      {!loading && iconRight && (
        <iconRight
          size={12}
          className="flex-shrink-0 ml-auto"
          strokeWidth={1.5}
        />
      )}
    </motion.button>
  );
}

/* ── IconButton ──────────────────────────────────────────── */
export function IconButton({
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  label,
  variant = "ghost",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  onClick,
  badge,
}) {
  const squareSizes = {
    xs: "w-6  h-6  rounded-md",
    sm: "w-7  h-7  rounded-lg",
    md: "w-8  h-8  rounded-lg",
    lg: "w-10 h-10 rounded-xl",
  };

  const iconSizes = { xs: 10, sm: 12, md: 14, lg: 16 };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.93 }}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex items-center justify-center flex-shrink-0",
        "transition-all duration-150 outline-none",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        VARIANTS[variant] ?? VARIANTS.ghost,
        squareSizes[size] ?? squareSizes.md,
        className,
      )}
    >
      {loading ? (
        <Loader2 size={iconSizes[size]} className="animate-spin" />
      ) : (
        <Icon size={iconSizes[size]} strokeWidth={1.5} />
      )}
      {badge != null && (
        <span
          className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full
                          bg-[#F43F5E] text-[8px] font-bold text-white
                          flex items-center justify-center leading-none"
        >
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </motion.button>
  );
}

/* ── ButtonGroup ─────────────────────────────────────────── */
export function ButtonGroup({ children, className = "" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center",
        "[&>button]:rounded-none",
        "[&>button:first-child]:rounded-l-lg",
        "[&>button:last-child]:rounded-r-lg",
        "[&>button:not(:first-child)]:-ml-px",
        className,
      )}
    >
      {children}
    </div>
  );
}
