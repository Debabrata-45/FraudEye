import { useState, useEffect } from 'react';
import client from '../../api/client';

const RoleBadge = ({ role }) => {
  const colors = role === 'ADMIN'
    ? 'bg-purple-900/40 text-purple-400 border-purple-700'
    : 'bg-blue-900/40 text-blue-400 border-blue-700';
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${colors}`}>
      {role}
    </span>
  );
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    client.get('/api/admin/users')
      .then((res) => setUsers(res.data?.users || res.data || []))
      .catch(() => setError('Failed to load users or endpoint not available yet'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 text-sm mt-1">Manage users and roles</p>
      </div>

      {loading && (
        <div className="text-gray-400 text-sm">Loading users...</div>
      )}

      {error && (
        <div className="px-4 py-3 bg-yellow-900/40 border border-yellow-700 rounded-lg text-yellow-400 text-sm mb-4">
          ⚠️ {error}
        </div>
      )}

      {/* Users Table */}
      {!loading && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-white font-semibold">Users ({users.length})</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Created At</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500">
                    No users found or endpoint not implemented yet.
                  </td>
                </tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id || i} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                    <td className="px-4 py-3 text-gray-300">{u.email}</td>
                    <td className="px-4 py-3"><RoleBadge role={u.role} /></td>
                    <td className="px-4 py-3 text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-900/40 text-green-400 border border-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}