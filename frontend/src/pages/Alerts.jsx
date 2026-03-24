import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Database, Wifi } from "lucide-react";
import { PageWrapper } from "../components/layout/PageShell";
import AlertsHeader from "./alerts/AlertsHeader";
import AlertsControls from "./alerts/AlertsControls";
import AlertsFeed from "./alerts/AlertsFeed";
import AlertDrawer from "./alerts/AlertDrawer";
import { useAlertsData } from "./alerts/useAlertsData";
import { AlertsFallbacks } from "../components/feedback";
import { applyAlertFilters } from "./alerts/alertsData";
import { cn } from "../utils/cn";

const DEFAULT_FILTERS = {
  search: "",
  severity: "ALL",
  status: "ALL",
  sort: "severity_desc",
};

export default function Alerts() {
  const { alerts, loading, error, summary, mode, toggleMode, refresh } =
    useAlertsData();

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = useMemo(
    () => applyAlertFilters(alerts, filters),
    [alerts, filters],
  );

  const hasFilters = useMemo(
    () =>
      filters.search || filters.severity !== "ALL" || filters.status !== "ALL",
    [filters],
  );

  const handleSelect = useCallback((alert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedAlert(null), 300);
  }, []);

  const handleFilters = useCallback((f) => setFilters(f), []);
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  if (loading) return <AlertsFallbacks.Loading />;
  if (error) return <AlertsFallbacks.Error onRetry={refresh} />;

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
          <div className="flex-1 min-w-0">
            <AlertsHeader summary={summary} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={toggleMode}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs transition-all",
                mode === "live"
                  ? "bg-[#22D3EE0A] border-[#22D3EE33] text-[#22D3EE]"
                  : "bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-slate-200",
              )}
            >
              {mode === "live" ? <Wifi size={12} /> : <Database size={12} />}
              {mode === "live" ? "Live" : "Demo"}
            </button>
            <button
              onClick={refresh}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg
                bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400
                hover:text-slate-200 hover:border-slate-600
                disabled:opacity-40 transition-all"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        </div>

        {/* Controls */}
        <AlertsControls
          filters={filters}
          onChange={handleFilters}
          onReset={handleReset}
          resultCount={filtered.length}
          totalCount={alerts.length}
        />

        {/* Main split: feed + drawer */}
        <div className="flex flex-1 gap-3 min-h-0 overflow-hidden">
          {/* Feed */}
          <div
            className={cn(
              "flex-1 min-w-0 overflow-auto transition-all duration-300",
              drawerOpen && "hidden xl:block",
            )}
          >
            {filtered.length === 0 ? (
              hasFilters ? (
                <AlertsFallbacks.NoResults
                  filterLabel={
                    filters.severity !== "ALL"
                      ? filters.severity
                      : filters.status
                  }
                  onReset={handleReset}
                />
              ) : alerts.length === 0 ? (
                <AlertsFallbacks.AllClear />
              ) : (
                <AlertsFallbacks.Empty />
              )
            ) : (
              <AlertsFeed
                alerts={filtered}
                selectedId={selectedAlert?.id}
                onSelect={handleSelect}
              />
            )}
          </div>

          {/* Drawer */}
          <AnimatePresence>
            {drawerOpen && (
              <motion.div
                key="alert-drawer"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 380, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex-shrink-0 overflow-hidden rounded-xl border border-slate-800"
                style={{ minWidth: drawerOpen ? 320 : 0 }}
              >
                <div className="w-[380px] h-full">
                  <AlertDrawer
                    alert={selectedAlert}
                    onClose={handleCloseDrawer}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageWrapper>
  );
}
