import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Save } from "lucide-react";

import { PageWrapper } from "../components/layout/PageShell";
import SettingsHeader from "./settings/SettingsHeader";
import { ProfileSection, AccessSection } from "./settings/ProfileSection";
import {
  DisplaySection,
  AlertSection,
  MonitoringSection,
  RiskDisplaySection,
  NotificationSection,
} from "./settings/PreferencesSection";
import SystemSection from "./settings/SystemSection";
import {
  DEFAULT_SETTINGS,
  MOCK_USER,
  SYSTEM_INFO,
} from "./settings/settingsData";

const STAGGER = { show: { transition: { staggerChildren: 0.07 } } };
const FADE_UP = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const Settings = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState({ ...DEFAULT_SETTINGS });
  const [saveState, setSaveState] = useState("idle"); // idle | dirty | saving | saved | error

  // Detect unsaved changes
  useEffect(() => {
    const isDirty = JSON.stringify(settings) !== JSON.stringify(saved);
    if (isDirty && saveState === "idle") setSaveState("dirty");
    if (!isDirty && saveState === "dirty") setSaveState("idle");
  }, [settings, saved, saveState]);

  const handleChange = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    setSaveState("saving");
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success for demo
      if (success) {
        setSaved({ ...settings });
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2500);
      } else {
        setSaveState("error");
        setTimeout(() => setSaveState("dirty"), 2500);
      }
    }, 900);
  }, [settings]);

  const handleReset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    setSaved({ ...DEFAULT_SETTINGS });
    setSaveState("idle");
  }, []);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(saved);

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <SettingsHeader saveState={saveState} user={MOCK_USER} />

        {/* Two-column layout */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 pb-6">
            {/* Left column — preferences */}
            <motion.div
              className="space-y-4"
              variants={STAGGER}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={FADE_UP}>
                <DisplaySection settings={settings} onChange={handleChange} />
              </motion.div>
              <motion.div variants={FADE_UP}>
                <AlertSection settings={settings} onChange={handleChange} />
              </motion.div>
              <motion.div variants={FADE_UP}>
                <MonitoringSection
                  settings={settings}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div variants={FADE_UP}>
                <RiskDisplaySection
                  settings={settings}
                  onChange={handleChange}
                />
              </motion.div>
              <motion.div variants={FADE_UP}>
                <NotificationSection
                  settings={settings}
                  onChange={handleChange}
                />
              </motion.div>
            </motion.div>

            {/* Right column — profile, access, system */}
            <motion.div
              className="space-y-4"
              variants={STAGGER}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={FADE_UP}>
                <ProfileSection user={MOCK_USER} />
              </motion.div>
              <motion.div variants={FADE_UP}>
                <AccessSection user={MOCK_USER} />
              </motion.div>
              <motion.div variants={FADE_UP}>
                <SystemSection info={SYSTEM_INFO} />
              </motion.div>
            </motion.div>
          </div>

          {/* Sticky save bar */}
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="sticky bottom-4 flex items-center justify-between gap-3 px-5 py-3.5
                rounded-2xl bg-slate-900/95 border border-slate-700/60 backdrop-blur-md
                shadow-2xl shadow-black/40 mx-0"
            >
              <p className="text-xs text-slate-400">
                You have{" "}
                <span className="text-amber-300 font-semibold">
                  unsaved changes
                </span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700 text-xs
                    text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/40
                    text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 hover:border-cyan-500/60
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Save size={11} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default Settings;
