import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import Layout from "./components/layout/Layout";
import Login from "./pages/auth/Login";
import Transactions from "./pages/Transactions";
import Alerts from "./pages/Alerts";

import Overview from "./pages/Overview";
import LiveMonitoring from "./pages/LiveMonitoring";
import PageShell from "./components/layout/PageShell";

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
                    <Route
                      path="/transactions"
                      element={<PageShell title="Transactions" />}
                    />
                    <Route
                      path="/alerts"
                      element={<PageShell title="Alerts" />}
                    />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route
                      path="/explanations"
                      element={<PageShell title="Explanations" />}
                    />
                    <Route
                      path="/analyst-review"
                      element={<PageShell title="Analyst Review" />}
                    />
                    <Route
                      path="/audit-logs"
                      element={<PageShell title="Audit Logs" />}
                    />
                    <Route
                      path="/settings"
                      element={<PageShell title="Settings" />}
                    />
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
