import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Save } from "lucide-react";
import { SaveBar } from "../components/feedback";

import { PageWrapper } from "../components/layout/PageShell";
import { SectionBlock, PanelCard } from "../components/Responsive";
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
  const [saveState, setSaveState] = useState("idle");

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
      const success = Math.random() > 0.1;
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
  const handleDiscard = useCallback(() => {
    setSettings({ ...saved });
    setSaveState("idle");
  }, [saved]);

  const isDirty = JSON.stringify(settings) !== JSON.stringify(saved);

  return (
    <PageWrapper>
      <div className="flex flex-col h-full min-h-0">
        <SettingsHeader saveState={saveState} user={MOCK_USER} />

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 pb-6">
            {/* Left — preferences */}
            <motion.div
              className="space-y-4"
              variants={STAGGER}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={FADE_UP}>
                <PanelCard>
                  <SectionBlock heading="Display & Interface">
                    <DisplaySection
                      settings={settings}
                      onChange={handleChange}
                    />
                  </SectionBlock>
                </PanelCard>
              </motion.div>

              <motion.div variants={FADE_UP}>
                <PanelCard>
                  <SectionBlock heading="Alert Preferences">
                    <AlertSection settings={settings} onChange={handleChange} />
                  </SectionBlock>
                </PanelCard>
              </motion.div>

              <motion.div variants={FADE_UP}>
                <PanelCard>
                  <SectionBlock heading="Monitoring">
                    <MonitoringSection
                      settings={settings}
                      onChange={handleChange}
                    />
                  </SectionBlock>
                </PanelCard>
              </motion.div>

              <motion.div variants={FADE_UP}>
                <PanelCard>
                  <SectionBlock heading="Risk Display">
                    <RiskDisplaySection
                      settings={settings}
                      onChange={handleChange}
                    />
                  </SectionBlock>
                </PanelCard>
              </motion.div>

              <motion.div variants={FADE_UP}>
                <PanelCard>
                  <SectionBlock heading="Notifications">
                    <NotificationSection
                      settings={settings}
                      onChange={handleChange}
                    />
                  </SectionBlock>
                </PanelCard>
              </motion.div>
            </motion.div>

            {/* Right — profile, access, system */}
            <motion.div
              className="space-y-4"
              variants={STAGGER}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={FADE_UP}>
                <PanelCard variant="elevated">
                  <ProfileSection user={MOCK_USER} />
                </PanelCard>
              </motion.div>

              <motion.div variants={FADE_UP}>
                <PanelCard variant="elevated">
                  <AccessSection user={MOCK_USER} />
                </PanelCard>
              </motion.div>

              <motion.div variants={FADE_UP}>
                <PanelCard variant="elevated">
                  <SystemSection info={SYSTEM_INFO} />
                </PanelCard>
              </motion.div>
            </motion.div>
          </div>

          {/* Inline sticky save bar (fallback if SaveBar not wired) */}
          {isDirty && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="sticky bottom-4 flex items-center justify-between gap-3 px-5 py-3.5
                rounded-2xl bg-slate-900/95 border border-slate-700/60 backdrop-blur-md
                shadow-2xl shadow-black/40"
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
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-700
                    text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-all"
                >
                  <RotateCcw size={11} />
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  disabled={saveState === "saving"}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/15
                    border border-cyan-500/40 text-cyan-300 text-xs font-semibold
                    hover:bg-cyan-500/25 hover:border-cyan-500/60
                    disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Save size={11} />
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* SaveBar from feedback layer */}
        <SaveBar
          isDirty={isDirty}
          saveStatus={saveState}
          onSave={handleSave}
          onDiscard={handleDiscard}
        />
      </div>
    </PageWrapper>
  );
};

export default Settings;
