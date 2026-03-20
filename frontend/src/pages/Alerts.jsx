import { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw, PanelRightOpen, PanelRightClose } from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import { SplitLayout } from "../components/Responsive";
import AlertsHeader from "./alerts/AlertsHeader";
import AlertsControls from "./alerts/AlertsControls";
import AlertsFeed from "./alerts/AlertsFeed";
import AlertDrawer from "./alerts/AlertDrawer";
import {
  MOCK_ALERTS,
  getAlertSummary,
  applyAlertFilters,
} from "./alerts/alertsData";

const DEFAULT_FILTERS = {
  search: "",
  severity: "ALL",
  status: "ALL",
  sort: "severity_desc",
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const isLive = true;

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setAlerts(MOCK_ALERTS);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, [refreshKey]);

  const filtered = useMemo(
    () => applyAlertFilters(alerts, filters),
    [alerts, filters],
  );
  const summary = useMemo(() => getAlertSummary(alerts), [alerts]);
  const hasFilters = useMemo(
    () =>
      filters.search || filters.severity !== "ALL" || filters.status !== "ALL",
    [filters],
  );

  const handleSelectAlert = useCallback((alert) => {
    setSelectedAlert(alert);
    setDrawerOpen(true);
  }, []);
  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedAlert(null), 280);
  }, []);
  const handleFilters = useCallback((f) => setFilters(f), []);
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const handleRefresh = useCallback(() => {
    setSelectedAlert(null);
    setDrawerOpen(false);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <AlertsHeader summary={summary} isLive={isLive} />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 pt-1">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="fe-btn-ghost"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={() =>
                drawerOpen ? handleCloseDrawer() : setDrawerOpen(true)
              }
              className={drawerOpen ? "fe-btn-danger" : "fe-btn-ghost"}
            >
              {drawerOpen ? (
                <PanelRightClose size={12} />
              ) : (
                <PanelRightOpen size={12} />
              )}
              <span className="hidden sm:block">Detail</span>
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

        {/* SplitLayout */}
        <SplitLayout
          list={
            <AlertsFeed
              alerts={filtered}
              selectedId={selectedAlert?.id}
              onSelect={handleSelectAlert}
              loading={loading}
              hasFilters={hasFilters}
            />
          }
          detail={
            <AlertDrawer alert={selectedAlert} onClose={handleCloseDrawer} />
          }
          detailOpen={drawerOpen}
          height={520}
        />
      </div>
    </PageWrapper>
  );
};

export default Alerts;
