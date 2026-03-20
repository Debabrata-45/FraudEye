import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Overview from "./pages/Overview";
import LiveMonitoring from "./pages/LiveMonitoring";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";
import Explanations from "./pages/Explanations";
import AnalystReview from "./pages/AnalystReview";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";

export default function App() {
  const { user } = useAuth();

  return (
    <>
      <div className="fe-bg-atmosphere" aria-hidden="true" />

      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to="/" replace />}
          />

          <Route
            path="/*"
            element={
              user ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/live" element={<LiveMonitoring />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/explanations" element={<Explanations />} />
                    <Route path="/analyst-review" element={<AnalystReview />} />
                    <Route path="/audit-logs" element={<AuditLogs />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
