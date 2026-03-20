/**
 * FraudEye Polish System — Phase 15 Barrel Export
 *
 * Import from: '../../components/polish'  (from pages/sub-components)
 *              '../components/polish'     (from pages/)
 *              './components/polish'      (from src/ root)
 *
 * ─────────────────────────────────────────────────────────────
 * HOOKS
 *
 *   useSpotlight()
 *     Returns a ref callback. Attach to any .fe-spotlight element.
 *     Tracks mousemove → sets --mouse-x / --mouse-y CSS vars.
 *     const ref = useSpotlight();
 *     <div ref={ref} className="fe-spotlight ...">
 *
 *   useSpotlightGroup(childSelector?)
 *     Returns a ref callback for a container element.
 *     Tracks the container's mousemove and updates all matching
 *     child cards at once. Better for KPI rows/grids.
 *     const ref = useSpotlightGroup('.fe-spotlight');
 *     <div ref={ref} className="grid ...">
 *       <div className="fe-spotlight ..."> ... </div>
 *     </div>
 *
 * ─────────────────────────────────────────────────────────────
 * COMPONENTS
 *
 *   BrandLogo({ collapsed })
 *     Full logo lockup with shield icon, gradient wordmark, accent line.
 *     Use in: Sidebar.jsx header area.
 *
 *   LiveBadge({ variant, label })
 *     variant: 'active' | 'paused' | 'disconnected'
 *     Use in: LiveHeader.jsx, Topbar.jsx
 *
 *   ScanFrame({ children })
 *     Wraps children with fe-scan-line CSS effect.
 *     Use ONLY in: ThreatFeed container in LiveMonitoring.
 *
 *   HeroLine()
 *     Animated gradient separator under page hero headings.
 *     Use in: OverviewHero.jsx, LiveHeader.jsx, any page hero.
 *
 *   ElitePanel({ children })
 *     Top-edge lit panel wrapper with premium surface treatment.
 *     Use in: XAIPreviewPanel, SpotlightPanel, TransactionDrawer.
 *
 *   CriticalPulseRing({ active })
 *     Pulsing red glow border wrapper for critical fraud items.
 *     Use on: critical-severity alert cards only.
 *
 *   GradientHeading({ gradient? })
 *     fe-section-heading with optional gradient text on the label.
 *     Replaces plain <h2 className="fe-section-heading"> in JSX.
 *
 *   PremiumButton({ variant, size, loading })
 *     Primary CTA with shine sweep + Framer Motion hover/press.
 *     variant: 'cyan' | 'violet' | 'danger'
 *     size:    'sm' | 'md' | 'lg'
 *     Use for primary save/submit actions only — not every button.
 *
 *   SystemStatusDot({ status, label })
 *     status: 'ok' | 'warn' | 'error' | 'idle'
 *     Use in: Topbar system status, Settings system section.
 *
 * ─────────────────────────────────────────────────────────────
 * CSS CLASSES (from polish.css — appended to index.css)
 *
 *   .fe-bg-atmosphere      — ambient background (App.jsx)
 *   .fe-dot-grid           — dot texture (main wrapper)
 *   .fe-spotlight          — cyan spotlight hover
 *   .fe-spotlight-danger   — red spotlight hover
 *   .fe-spotlight-ai       — violet spotlight hover
 *   .fe-glow-soft-cyan     — soft cyan glow border
 *   .fe-glow-soft-violet   — soft violet glow border
 *   .fe-glow-emphasis-cyan — strong cyan glow
 *   .fe-glow-emphasis-violet — strong violet glow
 *   .fe-glow-critical      — red critical glow
 *   .fe-glow-critical-pulse — pulsing red glow animation
 *   .fe-shine              — shine sweep on :hover (buttons)
 *   .fe-scan-line          — moving scan line (Live Monitoring only)
 *   .fe-gradient-text      — cyan→violet gradient text
 *   .fe-gradient-text-danger — pink→red gradient text
 *   .fe-section-heading    — left-accent section label
 *   .fe-panel-elite        — top-edge lit panel surface
 *   .fe-nav-active         — active nav item gradient
 *   .fe-table-row          — table row hover gradient
 *   .fe-glass              — glassmorphism surface
 *   .fe-chip-active        — active filter chip
 *   .fe-status-strip       — footer status bar
 *   .fe-live-dot-elite     — double-ring live pulse dot
 *   .fe-logo-glow          — text glow for logo wordmark
 *   .fe-logo-accent        — underline accent for logo
 *   .fe-hero-line          — gradient hero separator
 */

export { useSpotlight, useSpotlightGroup } from "./useSpotlight";

export {
  BrandLogo,
  LiveBadge,
  ScanFrame,
  HeroLine,
  ElitePanel,
  CriticalPulseRing,
  GradientHeading,
  PremiumButton,
  SystemStatusDot,
} from "./PolishComponents";
