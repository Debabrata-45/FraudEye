/**
 * useResponsive.js — FraudEye Responsive Behavior Hooks
 *
 * Phase 16 — centralizes all breakpoint-dependent behavior.
 * Zero external dependencies — uses matchMedia only.
 *
 * Exports:
 *   useBreakpoint()     — current breakpoint string
 *   useIsMobile()       — boolean < 768px
 *   useIsTablet()       — boolean 768–1023px
 *   useIsDesktop()      — boolean >= 1024px
 *   useDrawerBehavior() — should drawer be overlay or inline?
 *   useSidebarBehavior()— sidebar default collapsed state by screen
 *   useTableColumns()   — which columns to show at current width
 */

import { useState, useEffect, useCallback } from 'react';

/* ── Shared matchMedia subscriber ────────────────────────── */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined'
      ? window.matchMedia(query).matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/* ════════════════════════════════════════════════════════════
   BREAKPOINT DETECTION
   ════════════════════════════════════════════════════════════ */

/**
 * useBreakpoint — returns current active breakpoint label.
 * Values: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
 */
export function useBreakpoint() {
  const is2xl = useMediaQuery('(min-width: 1536px)');
  const isXl  = useMediaQuery('(min-width: 1280px)');
  const isLg  = useMediaQuery('(min-width: 1024px)');
  const isMd  = useMediaQuery('(min-width: 768px)');
  const isSm  = useMediaQuery('(min-width: 640px)');

  if (is2xl) return '2xl';
  if (isXl)  return 'xl';
  if (isLg)  return 'lg';
  if (isMd)  return 'md';
  if (isSm)  return 'sm';
  return 'xs';
}

/** Returns true when screen width < 768px */
export function useIsMobile() {
  return useMediaQuery('(max-width: 767px)');
}

/** Returns true when screen width is 768–1023px */
export function useIsTablet() {
  const isMd = useMediaQuery('(min-width: 768px)');
  const isLg = useMediaQuery('(min-width: 1024px)');
  return isMd && !isLg;
}

/** Returns true when screen width >= 1024px */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px)');
}

/* ════════════════════════════════════════════════════════════
   SIDEBAR BEHAVIOR
   ════════════════════════════════════════════════════════════ */

/**
 * useSidebarBehavior — controls sidebar default state per screen size.
 *
 * Returns:
 *   defaultCollapsed  — should sidebar start collapsed?
 *   isOverlay         — should sidebar be an overlay (mobile)?
 */
export function useSidebarBehavior() {
  const isDesktop = useIsDesktop();
  const isMobile  = useIsMobile();

  return {
    defaultCollapsed: !isDesktop,
    isOverlay:        isMobile,
  };
}

/* ════════════════════════════════════════════════════════════
   DRAWER BEHAVIOR
   ════════════════════════════════════════════════════════════ */

/**
 * useDrawerBehavior — determines whether detail drawer should be
 * inline (side-by-side with table) or overlay (fixed position).
 *
 * Returns:
 *   isOverlay  — true on < 1024px
 *   drawerWidth — number in px
 */
export function useDrawerBehavior() {
  const isDesktop = useIsDesktop();
  const isMobile  = useIsMobile();

  return {
    isOverlay:   !isDesktop,
    drawerWidth: isMobile ? Math.min(380, window.innerWidth * 0.92) : 380,
  };
}

/* ════════════════════════════════════════════════════════════
   TABLE COLUMN VISIBILITY
   ════════════════════════════════════════════════════════════ */

/**
 * useTableColumns — returns column visibility config.
 * Pass the result to your table to conditionally show/hide columns.
 *
 * Usage:
 *   const cols = useTableColumns();
 *   {cols.merchant && <th>Merchant</th>}
 */
export function useTableColumns() {
  const bp = useBreakpoint();

  const show = {
    // Always visible
    id:        true,
    risk:      true,
    amount:    true,
    status:    true,

    // Show on md+ (tablet)
    timestamp: bp !== 'xs' && bp !== 'sm',
    label:     bp !== 'xs' && bp !== 'sm',

    // Show on lg+ (laptop)
    merchant:  bp === 'lg' || bp === 'xl' || bp === '2xl',
    device:    bp === 'xl' || bp === '2xl',
    userId:    bp === 'xl' || bp === '2xl',
  };

  return show;
}

/* ════════════════════════════════════════════════════════════
   CHART HEIGHT ADAPTATION
   ════════════════════════════════════════════════════════════ */

/**
 * useChartHeight — returns appropriate chart height for current screen.
 * base: the default height on large screens.
 */
export function useChartHeight(base = 220) {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  if (isMobile) return Math.round(base * 0.72);
  if (isTablet) return Math.round(base * 0.88);
  return base;
}

/* ════════════════════════════════════════════════════════════
   MOBILE MENU OVERLAY
   ════════════════════════════════════════════════════════════ */

/**
 * useMobileMenu — controls mobile sidebar overlay open/close state.
 * Auto-closes when route changes or screen becomes desktop.
 */
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useIsDesktop();

  // Auto-close when screen grows to desktop
  useEffect(() => {
    if (isDesktop && isOpen) setIsOpen(false);
  }, [isDesktop, isOpen]);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  return { isOpen, open, close, toggle };
}