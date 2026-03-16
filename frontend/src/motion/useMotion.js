/**
 * useMotion.js — FraudEye Motion Hooks
 *
 * Hooks that connect the motion token system to React component behavior.
 *
 * Exports:
 *   useFraudEyeMotion   — master hook: returns all configs respecting reduced-motion
 *   useRowFlash         — manages SSE new-row flash state
 *   useLiveEntry        — triggers entry animation for real-time list items
 *   useStaggeredList    — returns per-item delay for manual stagger
 *   useValueChange      — detects value changes and triggers flash
 *   useSkeletonVisible  — controls skeleton → content transition
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import {
  DURATION,
  EASING,
  STAGGER,
  fadeUp,
  fade,
  rowEnter,
  rowEnterDanger,
  staggerNormal,
  staggerFast,
  HOVER,
  TAP,
  drawerRight,
  drawerLeft,
  modalCenter,
  overlayFade,
  getRiskMotion,
  safeVariant,
  staggerDelay,
} from "./motion";

/* ── useFraudEyeMotion ───────────────────────────────────── */
/**
 * Master hook — returns all motion configs, automatically
 * degrading to opacity-only when prefers-reduced-motion is set.
 *
 * Usage:
 *   const m = useFraudEyeMotion();
 *   <motion.div variants={m.fadeUp} initial="hidden" animate="visible" />
 */
export function useFraudEyeMotion() {
  const reduced = useReducedMotion();

  return {
    // Entry variants
    fadeUp: safeVariant(fadeUp, reduced),
    fade: safeVariant(fade, reduced),
    rowEnter: safeVariant(rowEnter, reduced),
    rowEnterDanger: safeVariant(rowEnterDanger, reduced),

    // Stagger containers
    staggerNormal,
    staggerFast,

    // Hover / tap (disabled when reduced motion)
    hover: reduced ? {} : HOVER,
    tap: reduced ? {} : TAP,

    // Overlays
    drawerRight: reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
      : drawerRight,
    drawerLeft: reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
      : drawerLeft,
    modalCenter: reduced
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }
      : modalCenter,
    overlayFade,

    // Flags
    reduced,
    DURATION,
    EASING,
  };
}

/* ── useRowFlash ─────────────────────────────────────────── */
/**
 * Manages the "new row" flash set for SSE live feeds.
 * Returns [newIds, markNew] — call markNew(id) when SSE fires.
 * The id is automatically removed after `ttl` ms.
 *
 * Usage:
 *   const [newIds, markNew] = useRowFlash();
 *   // when SSE arrives:
 *   markNew(txn.id);
 *   // in JSX:
 *   <TableRow isNew={newIds.has(txn.id)} ... />
 */
export function useRowFlash(ttl = 2000) {
  const [newIds, setNewIds] = useState(new Set());
  const timers = useRef(new Map());

  const markNew = useCallback(
    (id) => {
      setNewIds((prev) => new Set([...prev, id]));

      // Clear any existing timer for this id
      if (timers.current.has(id)) {
        clearTimeout(timers.current.get(id));
      }

      const timer = setTimeout(() => {
        setNewIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        timers.current.delete(id);
      }, ttl);

      timers.current.set(id, timer);
    },
    [ttl],
  );

  // Cleanup all timers on unmount
  useEffect(() => {
    const timersMap = timers.current;
    return () => {
      timersMap.forEach(clearTimeout);
    };
  }, []);

  return [newIds, markNew];
}

/* ── useLiveEntry ────────────────────────────────────────── */
/**
 * Tracks whether an item has "just arrived" for entry animation.
 * Returns isNew — true for the first `duration` ms after mount.
 *
 * Usage:
 *   const isNew = useLiveEntry(item.id, isLiveFeed);
 */
export function useLiveEntry(id, enabled = true, duration = 1200) {
  const [isNew, setIsNew] = useState(enabled);
  const prevId = useRef(id);

  useEffect(() => {
    if (!enabled) return;
    if (prevId.current !== id) {
      setIsNew(true);
      prevId.current = id;
    }
    const timer = setTimeout(() => setIsNew(false), duration);
    return () => clearTimeout(timer);
  }, [id, enabled, duration]);

  return isNew;
}

/* ── useStaggeredList ────────────────────────────────────── */
/**
 * Returns a function that gives each list item its stagger delay.
 * Use when you can't use stagger container variants (e.g. inside table tbody).
 *
 * Usage:
 *   const getDelay = useStaggeredList(items.length);
 *   {items.map((item, i) => (
 *     <motion.tr
 *       initial={{ opacity: 0, x: -6 }}
 *       animate={{ opacity: 1, x: 0 }}
 *       transition={getDelay(i)}
 *     />
 *   ))}
 */
export function useStaggeredList(
  count,
  spacing = STAGGER.fast,
  maxDelay = 0.4,
) {
  return useCallback(
    (index) => ({
      duration: DURATION.normal,
      ease: EASING.out,
      delay: Math.min(index * spacing, maxDelay),
    }),
    [spacing, maxDelay],
  );
}

/* ── useValueChange ──────────────────────────────────────── */
/**
 * Detects when a numeric/string value changes and returns
 * a key that forces Framer Motion to re-run the entry animation.
 * Use for live KPI values that update via SSE.
 *
 * Usage:
 *   const flashKey = useValueChange(metric.value);
 *   <motion.span key={flashKey} variants={valueFlash} initial="initial" animate="animate">
 *     {metric.value}
 *   </motion.span>
 */
export function useValueChange(value) {
  const [key, setKey] = useState(0);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      prev.current = value;
      setKey((k) => k + 1);
    }
  }, [value]);

  return key;
}

/* ── useSkeletonVisible ──────────────────────────────────── */
/**
 * Controls the skeleton → content crossfade transition.
 * Returns { showSkeleton, showContent } based on loading state.
 * Adds a minimum display time to prevent skeleton flash.
 *
 * Usage:
 *   const { showSkeleton, showContent } = useSkeletonVisible(isLoading);
 *   {showSkeleton && <CardSkeleton />}
 *   {showContent  && <ActualContent />}
 */
export function useSkeletonVisible(isLoading, minDisplayMs = 300) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading);
  const mountTime = useRef(null);

  useEffect(() => {
    // Set mount time once on first run (avoids calling Date.now during render)
    if (mountTime.current === null) {
      mountTime.current = Date.now();
    }
    if (!isLoading) {
      const elapsed = Date.now() - (mountTime.current ?? Date.now());
      const remaining = Math.max(0, minDisplayMs - elapsed);
      const timer = setTimeout(() => setShowSkeleton(false), remaining);
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
    }
  }, [isLoading, minDisplayMs]);

  return {
    showSkeleton,
    showContent: !showSkeleton,
  };
}

/* ── useRiskMotion ───────────────────────────────────────── */
/**
 * Returns the appropriate live-dot animation config for a risk level.
 * Critical → fast urgent pulse. Safe → slow calm pulse.
 *
 * Usage:
 *   const dotMotion = useRiskMotion('HIGH');
 *   <motion.span {...dotMotion} />
 */
export function useRiskMotion(level) {
  const reduced = useReducedMotion();
  if (reduced) return {};
  return getRiskMotion(level);
}

/* ── Re-export tokens for convenience ───────────────────── */
export {
  DURATION,
  EASING,
  STAGGER,
  fadeUp,
  fade,
  rowEnter,
  rowEnterDanger,
  staggerNormal,
  staggerFast,
  staggerDelay,
  HOVER,
  TAP,
  drawerRight,
  drawerLeft,
  modalCenter,
  overlayFade,
  getRiskMotion,
};
