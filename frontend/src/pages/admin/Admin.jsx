import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Users, Database, Activity,
  Shield, Server, Cpu, HardDrive
} from 'lucide-react';
import { API_BASE_URL } from '../../utils/constants';
import { cn } from '../../utils/cn';
import { motionVariants } from '../../styles/tokens';

function InfoRow({ label, value, mono }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-fe-border2 last:border-0">
      <span className="text-fe-text-3 text-xs uppercase tracking-wider">{label}</span>
      <span className={cn('text-fe-text-2 text-sm', mono && 'font-mono text-fe-cyan')}>
        {value || '—'}
      </span>
    </div>
  );
}

function StatusDot({ ok }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border',
      ok
        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
        : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full', ok ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400')} />
      {ok ? 'Healthy' : 'Error'}
    </span>
  );
}

export default function Admin() {
  const [health, setHealth]   = useState(null);
  const [mlHealth, setMlHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('fraudeye_token');

    Promise.all([
      fetch(`${API_BASE_URL}/health`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json()),
      fetch(`${API_BASE_URL.replace('4000', '8000')}/health`).then(r => r.json()),
    ])
      .then(([h, ml]) => {
        setHealth(h);
        setMlHealth(ml);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="fe-glass rounded-fe-xl p-5 border border-fe-border h-48 fe-shimmer" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={motionVariants.stagger}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={motionVariants.fadeUp}>
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-fe-cyan" />
          <h1 className="text-xl font-bold text-fe-text">Admin Panel</h1>
        </div>
        <p className="text-fe-text-3 text-sm">System health and configuration overview</p>
      </motion.div>

      {/* Health cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Backend health */}
        <motion.div
          variants={motionVariants.fadeUp}
          className="fe-glass rounded-fe-xl p-5 border border-fe-border fe-glow-cyan"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-fe bg-fe-cyan/10 flex items-center justify-center">
                <Server className="w-4 h-4 text-fe-cyan" />
              </div>
              <h3 className="text-fe-text font-semibold text-sm">Backend API</h3>
            </div>
            <StatusDot ok={health?.ok} />
          </div>
          <div className="space-y-0">
            <InfoRow label="Service"   value={health?.service} />
            <InfoRow label="Database"  value={health?.db}      />
            <InfoRow label="Redis"     value={health?.redis}   />
            <InfoRow label="Port"      value="4000" mono />
            <InfoRow label="Runtime"   value="Node.js 20" />
          </div>
        </motion.div>

        {/* ML Service health */}
        <motion.div
          variants={motionVariants.fadeUp}
          className="fe-glass rounded-fe-xl p-5 border border-fe-border fe-glow-violet"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-fe bg-fe-violet/10 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-fe-violet" />
              </div>
              <h3 className="text-fe-text font-semibold text-sm">ML Service</h3>
            </div>
            <StatusDot ok={mlHealth?.ok} />
          </div>
          <div className="space-y-0">
            <InfoRow label="Status"    value={mlHealth?.ok ? 'Running' : 'Offline'} />
            <InfoRow label="Framework" value="FastAPI + Uvicorn" />
            <InfoRow label="Model"     value="XGBoost xgb_v1" mono />
            <InfoRow label="Port"      value="8000" mono />
            <InfoRow label="Runtime"   value="Python 3.11" />
          </div>
        </motion.div>

        {/* Stack info */}
        <motion.div
          variants={motionVariants.fadeUp}
          className="fe-glass rounded-fe-xl p-5 border border-fe-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-fe bg-emerald-500/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-fe-text font-semibold text-sm">Infrastructure</h3>
          </div>
          <div className="space-y-0">
            <InfoRow label="Database"    value="PostgreSQL 16" />
            <InfoRow label="Queue"       value="Redis 7 + BullMQ" />
            <InfoRow label="Deployment"  value="Docker Compose" />
            <InfoRow label="DB Port"     value="5433" mono />
            <InfoRow label="Redis Port"  value="6379" mono />
          </div>
        </motion.div>

        {/* Model info */}
        <motion.div
          variants={motionVariants.fadeUp}
          className="fe-glass rounded-fe-xl p-5 border border-fe-border"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-fe bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-fe-text font-semibold text-sm">Model Info</h3>
          </div>
          <div className="space-y-0">
            <InfoRow label="Active Model"   value="xgb_v1" mono />
            <InfoRow label="Algorithm"      value="XGBoost" />
            <InfoRow label="Features"       value="10 behavioral" />
            <InfoRow label="XAI"            value="SHAP + LIME" />
            <InfoRow label="ROC-AUC"        value="0.9962" mono />
            <InfoRow label="F1 Score"       value="0.8308" mono />
          </div>
        </motion.div>
      </div>

      {/* Demo credentials */}
      <motion.div
        variants={motionVariants.fadeUp}
        className="fe-glass rounded-fe-xl p-5 border border-fe-border"
      >
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-fe-cyan" />
          <h3 className="text-fe-text font-semibold text-sm fe-section-heading">Demo Credentials</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { role: 'Admin',   email: 'admin@fraudeye.com',   pass: 'Admin@12345',   color: 'fe-glow-violet', accent: 'text-fe-violet' },
            { role: 'Analyst', email: 'analyst@fraudeye.com', pass: 'Analyst@12345', color: 'fe-glow-cyan',   accent: 'text-fe-cyan'   },
          ].map((cred) => (
            <div key={cred.role} className={cn(
              'fe-glass-light rounded-fe p-4 border border-fe-border2',
              cred.color
            )}>
              <p className={cn('text-xs font-semibold uppercase tracking-wider mb-2', cred.accent)}>
                {cred.role}
              </p>
              <p className="text-fe-text-2 text-xs font-mono">{cred.email}</p>
              <p className="text-fe-text-3 text-xs font-mono mt-0.5">{cred.pass}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}