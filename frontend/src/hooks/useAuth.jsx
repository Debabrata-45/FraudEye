// eslint-disable-next-line react-refresh/only-export-components
import { useState, useEffect, createContext, useContext } from 'react';
import { login as loginApi } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fraudeye_user');
      const token = localStorage.getItem('fraudeye_token');
      if (stored && stored !== 'undefined' && token) {
        setUser(JSON.parse(stored));
      }
    } catch (e) {
      localStorage.removeItem('fraudeye_user');
      localStorage.removeItem('fraudeye_token');
    } finally {
      setLoading(false);
    }
  }, []);
  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem('fraudeye_token', data.token);
    localStorage.setItem('fraudeye_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('fraudeye_token');
    localStorage.removeItem('fraudeye_user');
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isAnalyst = () => user?.role === 'ANALYST' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isAnalyst }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};