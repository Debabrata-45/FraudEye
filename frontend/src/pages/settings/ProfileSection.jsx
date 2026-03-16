import { motion } from "framer-motion";
import { Shield, Key } from "lucide-react";
import { SettingsCard, InfoPill } from "./SettingsComponents";

// ─── Profile section ──────────────────────────────────────────────────────────
export const ProfileSection = ({ user }) => (
  <SettingsCard
    title="Profile"
    description="Your analyst identity and account information"
    icon="👤"
  >
    {/* Avatar card */}
    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 border border-slate-700/40">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-xl font-black text-white flex-shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
        {user.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-slate-100">{user.name}</p>
        <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-semibold">
            {user.role}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-violet-500/10 border border-violet-500/20 text-violet-300 font-medium">
            {user.level}
          </span>
        </div>
      </div>
    </div>

    {/* Meta pills */}
    <div className="flex flex-wrap gap-2">
      <InfoPill label="Joined" value={user.joined} />
      <InfoPill label="Last Login" value={user.lastLogin} />
    </div>
  </SettingsCard>
);

// ─── Access / role block ──────────────────────────────────────────────────────
export const AccessSection = ({ user }) => (
  <SettingsCard
    title="Access & Permissions"
    description="Your current role capabilities and access scope"
    icon="🔐"
  >
    <div className="flex items-center gap-2 mb-3">
      <Shield size={14} className="text-emerald-400" />
      <span className="text-xs font-semibold text-emerald-300">
        Active Session
      </span>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#22C55E] animate-pulse ml-auto" />
    </div>

    <div className="space-y-1.5">
      {user.permissions.map((perm, i) => (
        <motion.div
          key={perm}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/30 border border-slate-700/30"
        >
          <Key size={11} className="text-cyan-400 flex-shrink-0" />
          <span className="text-xs text-slate-300">{perm}</span>
          <span className="ml-auto text-[10px] text-emerald-400 font-medium">
            Granted
          </span>
        </motion.div>
      ))}
    </div>

    <p className="text-[11px] text-slate-600 mt-2">
      Permission changes require admin approval and system re-authentication.
    </p>
  </SettingsCard>
);
