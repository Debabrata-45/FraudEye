/**
 * Sidebar.jsx — FraudEye Premium Sidebar Navigation
 *
 * Features:
 *  - FraudEye logo + wordmark
 *  - All 8 navigation sections with Lucide icons
 *  - Active route highlighting
 *  - Hover states
 *  - Expandable / icon-only collapsed mode
 *  - Bottom: system status + user profile mini
 *  - Subtle animated scan line on logo
 */

import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Radio,
  ArrowLeftRight,
  Bell,
  BrainCircuit,
  ClipboardCheck,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Circle,
} from 'lucide-react';
import { cn } from '../../utils/cn';

/* ── Nav config ──────────────────────────────────────────── */
const NAV_SECTIONS = [
  {
    label: 'Monitor',
    items: [
      { to: '/',      label: 'Overview',       icon: LayoutDashboard, exact: true },
      { to: '/live',  label: 'Live Monitoring', icon: Radio,           badge: 'LIVE' },
    ],
  },
  {
    label: 'Investigate',
    items: [
      { to: '/transactions',   label: 'Transactions',   icon: ArrowLeftRight },
      { to: '/alerts',         label: 'Alerts',         icon: Bell,          badgeDot: true },
      { to: '/explanations',   label: 'Explanations',   icon: BrainCircuit  },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/analyst-review', label: 'Analyst Review', icon: ClipboardCheck },
      { to: '/audit-logs',     label: 'Audit Logs',     icon: ScrollText    },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
];

/* ── Badge component ─────────────────────────────────────── */
function NavBadge({ text }) {
  return (
    <span className="ml-auto text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded
                     bg-[#22D3EE18] text-[#22D3EE] border border-[#22D3EE33]">
      {text}
    </span>
  );
}

function NavDot() {
  return (
    <span className="ml-auto flex items-center">
      <span className="fe-live-dot w-1.5 h-1.5" />
    </span>
  );
}

/* ── Single nav item ─────────────────────────────────────── */
function NavItem({ item, collapsed }) {
  const location = useLocation();
  const isActive = item.exact
    ? location.pathname === item.to
    : location.pathname.startsWith(item.to) && item.to !== '/';

  const Icon = item.icon;

  return (
    <NavLink
      to={item.to}
      end={item.exact}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2.5',
        'text-sm font-medium transition-all duration-150',
        isActive
          ? 'fe-nav-active text-[#22D3EE]'
          : 'text-[#64748B] hover:text-[#CBD5E1] hover:bg-[#FFFFFF06]',
        collapsed ? 'justify-center px-0' : '',
      )}
      title={collapsed ? item.label : undefined}
    >
      {/* Active left bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-[#22D3EE]" />
      )}

      {/* Icon */}
      <span className={cn(
        'flex-shrink-0 transition-colors duration-150',
        isActive ? 'text-[#22D3EE]' : 'text-[#475569] group-hover:text-[#94A3B8]',
      )}>
        <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
      </span>

      {/* Label + badge */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-2 flex-1 overflow-hidden whitespace-nowrap"
          >
            <span className="flex-1">{item.label}</span>
            {item.badge    && <NavBadge text={item.badge} />}
            {item.badgeDot && <NavDot />}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip on collapsed */}
      {collapsed && (
        <span className="fe-tooltip left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none
                         opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {item.label}
        </span>
      )}
    </NavLink>
  );
}

/* ── Section group ────────────────────────────────────────── */
function NavSection({ section, collapsed }) {
  return (
    <div className="mb-1">
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-[#334155]"
          >
            {section.label}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-0.5">
        {section.items.map((item) => (
          <NavItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </div>
    </div>
  );
}

/* ── Main sidebar ─────────────────────────────────────────── */
export default function Sidebar({
  collapsed,
  onToggle,
  width,
  miniWidth,
  isMobileDrawer = false,
}) {
  const w = collapsed ? miniWidth : width;

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        'flex flex-col h-screen flex-shrink-0 overflow-hidden',
        'bg-[#080F1A] border-r border-[#0F1F35]',
        isMobileDrawer ? 'w-full' : 'fixed left-0 top-0 bottom-0 z-30',
      )}
      style={{ width: isMobileDrawer ? width : w }}
    >
      {/* ── Logo / Brand ───────────────────────────────────── */}
      <div className={cn(
        'flex items-center gap-3 px-4 py-5 flex-shrink-0 relative overflow-hidden',
        'border-b border-[#0F1F35]',
        collapsed ? 'justify-center px-0' : '',
      )}>
        {/* Scan line animation */}
        <motion.div
          className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE22] to-transparent"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Icon mark */}
        <div className="relative flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-[#22D3EE14] border border-[#22D3EE33]
                          flex items-center justify-center">
            <ShieldAlert size={16} className="text-[#22D3EE]" strokeWidth={1.5} />
          </div>
          {/* Pulse ring */}
          <span className="absolute -inset-0.5 rounded-lg border border-[#22D3EE22] animate-pulse" />
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col leading-none overflow-hidden"
            >
              <span className="text-[15px] font-bold tracking-tight fe-gradient-text">
                FraudEye
              </span>
              <span className="text-[10px] text-[#334155] font-medium tracking-widest uppercase mt-0.5">
                AI · Fraud Detection
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className={cn(
        'flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-4',
        collapsed ? 'px-2' : 'px-3',
      )}>
        {collapsed ? (
          /* Icon-only: flat list without section labels */
          <div className="flex flex-col gap-0.5">
            {NAV_SECTIONS.flatMap((s) => s.items).map((item) => (
              <NavItem key={item.to} item={item} collapsed={true} />
            ))}
          </div>
        ) : (
          NAV_SECTIONS.map((section) => (
            <NavSection key={section.label} section={section} collapsed={false} />
          ))
        )}
      </nav>

      {/* ── Bottom: system status + collapse toggle ─────────── */}
      <div className="flex-shrink-0 border-t border-[#0F1F35]">

        {/* System status pill */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mx-3 my-3 px-3 py-2 rounded-lg bg-[#22C55E08] border border-[#22C55E18]
                         flex items-center gap-2"
            >
              <span className="fe-live-dot w-1.5 h-1.5" />
              <span className="text-[11px] text-[#22C55E] font-medium flex-1">All systems operational</span>
              <Circle size={8} className="text-[#22C55E]" fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse toggle button */}
        {!isMobileDrawer && (
          <button
            onClick={onToggle}
            className={cn(
              'w-full flex items-center gap-2 px-4 py-3',
              'text-[#334155] hover:text-[#64748B] transition-colors duration-150',
              'hover:bg-[#FFFFFF04]',
              collapsed ? 'justify-center' : '',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed
              ? <ChevronRight size={14} strokeWidth={1.5} />
              : (
                <>
                  <ChevronLeft size={14} strokeWidth={1.5} />
                  <span className="text-[11px] font-medium tracking-wide">Collapse</span>
                </>
              )
            }
          </button>
        )}
      </div>
    </motion.aside>
  );
}