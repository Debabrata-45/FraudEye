import { useState, useEffect, useMemo, useCallback } from "react";
import { RefreshCw, PanelRightOpen, PanelRightClose } from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import { ControlsBar, DataTable, SplitLayout } from "../components/Responsive";
import AuditHeader from "./audit/AuditHeader";
import AuditControls from "./audit/AuditControls";
import AuditTable from "./audit/AuditTable";
import AuditDrawer from "./audit/AuditDrawer";
import {
  MOCK_LOGS,
  getAuditSummary,
  applyAuditFilters,
} from "./audit/auditData";

const DEFAULT_FILTERS = {
  search: "",
  actor: "ALL",
  category: "ALL",
  sort: "time_desc",
};

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedLog, setSelectedLog] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setLogs(MOCK_LOGS);
      setLoading(false);
    }, 750);
    return () => clearTimeout(t);
  }, [refreshKey]);

  const filtered = useMemo(
    () => applyAuditFilters(logs, filters),
    [logs, filters],
  );
  const summary = useMemo(() => getAuditSummary(logs), [logs]);
  const hasFilters = useMemo(
    () =>
      filters.search || filters.actor !== "ALL" || filters.category !== "ALL",
    [filters],
  );

  const handleSelect = useCallback((log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  }, []);
  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setTimeout(() => setSelectedLog(null), 280);
  }, []);
  const handleFilters = useCallback((f) => setFilters(f), []);
  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const handleExport = useCallback(() => {}, []);
  const handleRefresh = useCallback(() => {
    setSelectedLog(null);
    setDrawerOpen(false);
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <AuditHeader summary={summary} />
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
              className={drawerOpen ? "fe-btn-primary" : "fe-btn-ghost"}
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
        <ControlsBar>
          <AuditControls
            filters={filters}
            onChange={handleFilters}
            onReset={handleReset}
            onExport={handleExport}
            resultCount={filtered.length}
            totalCount={logs.length}
          />
        </ControlsBar>

        {/* Table + drawer via SplitLayout */}
        <SplitLayout
          list={
            <DataTable>
              <AuditTable
                logs={filtered}
                selectedId={selectedLog?.id}
                onSelect={handleSelect}
                loading={loading}
                hasFilters={hasFilters}
              />
            </DataTable>
          }
          detail={<AuditDrawer log={selectedLog} onClose={handleCloseDrawer} />}
          detailOpen={drawerOpen}
          height={520}
        />
      </div>
    </PageWrapper>
  );
};

export default AuditLogs;
