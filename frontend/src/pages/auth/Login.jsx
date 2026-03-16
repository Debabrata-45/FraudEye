import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import { motion } from 'framer-motion';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const { user, login, loading } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={ROUTES.TRANSACTIONS} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err?.response?.data?.error?.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-fe-bg fe-dot-grid flex items-center justify-center px-4 relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-fe-cyan/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fe-violet/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-fe-xl bg-gradient-to-br from-fe-cyan to-fe-violet mb-4 shadow-fe-glow-cyan"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold fe-gradient-text mb-1">FraudEye</h1>
          <p className="text-fe-text-3 text-sm">AI Fraud Intelligence Command Center</p>
        </div>

        {/* Card */}
        <div className="fe-glass rounded-fe-xl p-8 fe-glow-cyan">

          <h2 className="text-fe-text font-semibold text-lg mb-1">Sign in</h2>
          <p className="text-fe-text-3 text-sm mb-6">Access your fraud monitoring dashboard</p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 px-4 py-3 rounded-fe bg-fe-danger/10 border border-fe-danger/30 text-fe-danger text-sm mb-5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-fe-text-2 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="analyst@fraudeye.com"
                required
                className="w-full bg-fe-surface border border-fe-border text-fe-text text-sm rounded-fe px-4 py-2.5 placeholder:text-fe-text-3 focus:outline-none focus:border-fe-cyan transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-fe-text-2 text-xs font-medium mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-fe-surface border border-fe-border text-fe-text text-sm rounded-fe px-4 py-2.5 pr-10 placeholder:text-fe-text-3 focus:outline-none focus:border-fe-cyan transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fe-text-3 hover:text-fe-text-2 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 rounded-fe bg-gradient-to-r from-fe-cyan to-fe-violet text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all mt-2 shadow-fe-glow-cyan"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in to FraudEye'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-5 border-t border-fe-border">
            <p className="text-fe-text-3 text-xs text-center mb-3 uppercase tracking-wider">Demo credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setEmail('analyst@fraudeye.com'); setPassword('Analyst@12345'); }}
                className="px-3 py-2 rounded-fe bg-fe-surface border border-fe-border text-fe-text-2 text-xs hover:border-fe-cyan/50 hover:text-fe-cyan transition-all text-left"
              >
                <p className="font-medium">Analyst</p>
                <p className="text-fe-text-3 text-xs mt-0.5">analyst@fraudeye.com</p>
              </button>
              <button
                onClick={() => { setEmail('admin@fraudeye.com'); setPassword('Admin@12345'); }}
                className="px-3 py-2 rounded-fe bg-fe-surface border border-fe-border text-fe-text-2 text-xs hover:border-fe-violet/50 hover:text-fe-violet transition-all text-left"
              >
                <p className="font-medium">Admin</p>
                <p className="text-fe-text-3 text-xs mt-0.5">admin@fraudeye.com</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-fe-text-3 text-xs mt-6">
          FraudEye — AI-Powered Fraud Detection with XAI
        </p>
      </motion.div>
    </div>
  );
}