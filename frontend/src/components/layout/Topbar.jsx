/**
 * Topbar.jsx — FraudEye Sticky Operational Topbar
 *
 * Features:
 *  - Frosted glass with subtle bottom border
 *  - Page title + sub breadcrumb
 *  - Live clock (HH:MM:SS UTC)
 *  - System status dot
 *  - Notification bell (badge)
 *  - User profile chip
 *  - Hamburger for mobile
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Bell,
  ChevronRight,
  Clock,
  User,
  LogOut,
  Shield,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

/* ── Live clock ──────────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toUTCString().slice(17, 25) + ' UTC',
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono
                    text-[#475569] border border-[#1E293B] rounded-md px-2.5 py-1.5
                    bg-[#0A1628]">
      <Clock size={11} className="text-[#334155]" />
      <span className="tabular-nums tracking-wide">{time}</span>
    </div>
  );
}

/* ── System status indicator ─────────────────────────────── */
function SystemStatus() {
  return (
    <div className="hidden md:flex items-center gap-1.5 text-[11px] text-[#22C55E]
                    border border-[#22C55E18] bg-[#22C55E08] rounded-md px-2.5 py-1.5">
      <span className="fe-live-dot w-1.5 h-1.5" />
      <span className="font-medium tracking-wide">Operational</span>
    </div>
  );
}

/* ── Profile dropdown ────────────────────────────────────── */
function ProfileChip({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'FE';

  const role = user?.role === 'admin' ? 'Admin' : 'Analyst';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg',
          'border border-[#1E293B] bg-[#0A1628]',
          'hover:border-[#334155] hover:bg-[#111827]',
          'transition-all duration-150',
        )}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {/* Avatar */}
        <span className="w-6 h-6 rounded-md bg-[#22D3EE18] border border-[#22D3EE33]
                          flex items-center justify-center text-[10px] font-bold text-[#22D3EE]">
          {initials}
        </span>
        <div className="hidden sm:flex flex-col items-start leading-none">
          <span className="text-[11px] font-medium text-[#CBD5E1]">
            {user?.email?.split('@')[0] ?? 'user'}
          </span>
          <span className="text-[10px] text-[#475569] flex items-center gap-1 mt-0.5">
            <Shield size={8} />
            {role}
          </span>
        </div>
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 z-50 w-52
                       fe-glass border border-[#1E293B] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-[#1E293B]">
              <p className="text-xs font-semibold text-[#F8FAFC]">
                {user?.email ?? '—'}
              </p>
              <p className="text-[10px] text-[#475569] mt-0.5 flex items-center gap-1">
                <Shield size={9} />
                {role} · FraudEye
              </p>
            </div>

            {/* Profile option */}
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#94A3B8]
                         hover:text-[#F8FAFC] hover:bg-[#FFFFFF06] transition-colors"
              onClick={() => setOpen(false)}
            >
              <User size={14} />
              Profile
            </button>

            {/* Logout */}
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#F43F5E]
                         hover:bg-[#F43F5E08] transition-colors border-t border-[#1E293B]"
              onClick={() => { setOpen(false); onLogout?.(); }}
            >
              <LogOut size={14} />
              Sign out
            </button>
          </motion.div>
        </>
      )}
    </div>
  );
}

/* ── Topbar ───────────────────────────────────────────────── */
export default function Topbar({ title, sub, onMenuClick, collapsed, isMobile }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  /* Track scroll for shadow */
  useEffect(() => {
    const el = document.getElementById('fe-main');
    if (!el) return;
    const handler = () => setScrolled(el.scrollTop > 8);
    el.addEventListener('scroll', handler, { passive: true });
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex-shrink-0',
        'flex items-center justify-between gap-4',
        'px-5 h-14',
        'bg-[#020617]/80 backdrop-blur-md',
        'border-b border-[#0F172A]',
        'transition-shadow duration-200',
        scrolled && 'shadow-[0_1px_0_0_#22D3EE0A,0_4px_24px_0_#00000040]',
      )}
    >
      {/* ── Left: hamburger + breadcrumb ─────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — mobile always, desktop when collapsed */}
        {(isMobile || collapsed) && (
          <button
            onClick={onMenuClick}
            className="flex-shrink-0 p-1.5 rounded-lg text-[#475569] hover:text-[#94A3B8]
                       hover:bg-[#FFFFFF06] transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu size={18} strokeWidth={1.5} />
          </button>
        )}

        {/* Page title */}
        <motion.div
          key={title}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-2 min-w-0"
        >
          {/* Breadcrumb divider — shown on desktop */}
          {!isMobile && !collapsed && (
            <ChevronRight size={14} className="text-[#1E293B] flex-shrink-0" />
          )}
          <div className="min-w-0">
            <h1 className="text-[15px] font-semibold text-[#F8FAFC] leading-none truncate">
              {title}
            </h1>
            {sub && (
              <p className="text-[11px] text-[#334155] mt-0.5 leading-none hidden sm:block truncate">
                {sub}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Right: status + clock + bell + profile ─────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <SystemStatus />
        <LiveClock />

        {/* Notification bell */}
        <button
          className="relative p-1.5 rounded-lg text-[#475569] hover:text-[#94A3B8]
                     hover:bg-[#FFFFFF06] border border-transparent hover:border-[#1E293B]
                     transition-all duration-150"
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.5} />
          {/* Unread dot */}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#F43F5E]
                            shadow-[0_0_4px_#F43F5E]" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-[#1E293B] mx-0.5" />

        {/* Profile */}
        <ProfileChip user={user} onLogout={logout} />
      </div>
    </header>
  );
}