import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import TransactionsFeed from './pages/transactions/TransactionsFeed';
import Analytics from './pages/analytics/Analytics';
import QueueMonitor from './pages/queue/QueueMonitor';
import Admin from './pages/admin/Admin';
import { ROUTES } from './utils/constants';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected */}
          <Route element={<Layout />}>
            <Route path={ROUTES.TRANSACTIONS} element={<TransactionsFeed />} />
            <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
            <Route path={ROUTES.QUEUE} element={<QueueMonitor />} />
            <Route path={ROUTES.ADMIN} element={<Admin />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to={ROUTES.TRANSACTIONS} replace />} />
          <Route path="*" element={<Navigate to={ROUTES.TRANSACTIONS} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}