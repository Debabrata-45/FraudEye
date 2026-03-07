import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { ROUTES } from '../../utils/constants';

const navItems = [
  { label: 'Live Feed', path: ROUTES.TRANSACTIONS, icon: '⚡' },
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: '📊' },
  { label: 'Queue', path: ROUTES.QUEUE, icon: '🔄' },
  { label: 'Admin', path: ROUTES.ADMIN, icon: '👤', adminOnly: true },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-700">
        <h1 className="text-xl font-bold text-red-400">🛡 FraudEye</h1>
        <p className="text-xs text-gray-400 mt-1">Fraud Detection System</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin()) return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-gray-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-sm font-bold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.email || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.role || 'ANALYST'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-left text-xs text-gray-400 hover:text-red-400 transition-colors"
        >
          → Logout
        </button>
      </div>
    </aside>
  );
}