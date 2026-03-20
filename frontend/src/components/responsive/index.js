/**
 * FraudEye Responsive & Consistency System — Phase 16 Barrel Export
 *
 * Import from: '../../components/responsive'  (from pages/sub-components)
 *              '../components/responsive'     (from pages/)
 *
 * ─────────────────────────────────────────────────────────────
 * HOOKS
 *
 *   useBreakpoint()      → 'xs'|'sm'|'md'|'lg'|'xl'|'2xl'
 *   useIsMobile()        → boolean (< 768px)
 *   useIsTablet()        → boolean (768–1023px)
 *   useIsDesktop()       → boolean (>= 1024px)
 *   useDrawerBehavior()  → { isOverlay, drawerWidth }
 *   useSidebarBehavior() → { defaultCollapsed, isOverlay }
 *   useTableColumns()    → { id, risk, amount, status, timestamp, label, merchant, device, userId }
 *   useChartHeight(base) → number
 *   useMobileMenu()      → { isOpen, open, close, toggle }
 *
 * ─────────────────────────────────────────────────────────────
 * LAYOUT COMPONENTS
 *
 *   PageLayout({ children })
 *     Responsive page wrapper — correct padding at every breakpoint.
 *     Use instead of manual "px-5 md:px-6 lg:px-8 pt-6 pb-12" patterns.
 *
 *   PageHeader({ title, subtitle, badge, actions })
 *     Consistent page title block with responsive wrap.
 *
 *   SectionBlock({ heading, headingAction, delay })
 *     Section container with consistent heading + gap.
 *
 *   ControlsBar({ children })
 *     Responsive filter/search/action row with auto-wrap.
 *
 *   SplitLayout({ list, detail, detailOpen, height })
 *     Responsive two-panel layout (list + drawer).
 *     Auto-switches: inline on xl+, overlay on < 1024px.
 *
 *   ThreeColLayout({ queue, detail, actions, height })
 *     Three-column analyst workspace — stacks on mobile.
 *
 *   CardGrid({ cols, spotlight, gap })
 *     Responsive card grid with optional spotlight tracking.
 *     cols: 2|3|4|6
 *
 *   DataTable({ children })
 *     Horizontally scrollable table wrapper with fe-card styling.
 *
 *   PanelCard({ variant, spotlight, glow })
 *     variant: 'default'|'elevated'|'inner'|'elite'
 *     glow: 'soft-cyan'|'soft-violet'|'emphasis-cyan'|'emphasis-violet'|'critical'
 *
 *   PanelHeader({ icon, iconColor, title, subtitle, right })
 *     Consistent header row for all panels and cards.
 *
 *   Divider()
 *     Standard horizontal rule between sections.
 *
 *   MetaRow({ label, value, mono })
 *     Label + value row for drawers and detail panels.
 *
 * ─────────────────────────────────────────────────────────────
 * CSS (from responsive.css — append to index.css)
 *
 *   .fe-page-wrapper      — responsive page padding
 *   .fe-kpi-grid          — responsive KPI grid
 *   .fe-table-container   — horizontal scroll table wrapper
 *   .fe-col-optional      — hide on < 1024px
 *   .fe-col-secondary     — hide on < 768px
 *   .fe-drawer-inline     — overlay on < 1024px
 *   .fe-controls-bar      — responsive filter bar
 *   .fe-card / .fe-card-elevated / .fe-card-inner — surface system
 *   .fe-panel-header      — standard panel header
 *   .fe-badge-*           — unified severity badge classes
 *   .fe-btn-ghost / .fe-btn-primary / .fe-btn-danger — button system
 *   .fe-hover-lift        — unified hover lift
 *   .fe-text-xs/sm/base   — min-readable text sizes
 *   .fe-page-title        — clamp(20px, 3vw, 30px) heading
 *   .fe-metric-value      — clamp KPI value size
 *   .fe-body-text         — clamp body paragraph size
 *   .fe-fade-up + .fe-stagger-1..6 — consistent entry animation
 */

export {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useDrawerBehavior,
  useSidebarBehavior,
  useTableColumns,
  useChartHeight,
  useMobileMenu,
} from "./useResponsive";

export {
  PageLayout,
  PageHeader,
  SectionBlock,
  ControlsBar,
  SplitLayout,
  ThreeColLayout,
  CardGrid,
  DataTable,
  PanelCard,
  PanelHeader,
  Divider,
  MetaRow,
} from "./ConsistencyComponents";
