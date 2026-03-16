import { useMemo } from "react";
import { motion } from "framer-motion";
import ChartContainer from "./ChartContainer";

const HOURS = Array.from(
  { length: 24 },
  (_, i) => `${String(i).padStart(2, "0")}:00`,
);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Seed-stable fake heatmap values ─────────────────────────────────────────
const generateHeatmap = () =>
  DAYS.map((day, di) =>
    HOURS.map((_, hi) => {
      const isNight = hi >= 0 && hi <= 5;
      const isEvening = hi >= 20 && hi <= 23;
      const isWeekend = di >= 5;
      const isMidDay = hi >= 11 && hi <= 14;
      let val = 5 + ((di * 7 + hi * 3) % 20);
      if (isNight) val += 15 + ((di + hi) % 12);
      if (isEvening) val += 12 + ((di * hi) % 10);
      if (isWeekend) val += 8;
      if (isMidDay) val -= 5;
      return Math.max(2, Math.min(val, 60));
    }),
  );

const getColor = (val) => {
  if (val >= 50) return { bg: "#F43F5E", opacity: 0.85 };
  if (val >= 38) return { bg: "#F97316", opacity: 0.75 };
  if (val >= 26) return { bg: "#F59E0B", opacity: 0.65 };
  if (val >= 15) return { bg: "#22D3EE", opacity: 0.4 };
  return { bg: "#334155", opacity: 0.4 };
};

const ActivityHeatmap = ({ size = "lg", delay = 0 }) => {
  const grid = useMemo(() => generateHeatmap(), []);

  return (
    <ChartContainer
      title="Fraud Activity by Time of Day"
      subtitle="Hourly fraud concentration across the week — darker = higher risk"
      size={size}
      delay={delay}
    >
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {/* Hour labels */}
          <div className="flex mb-1 ml-8">
            {HOURS.filter((_, i) => i % 4 === 0).map((h) => (
              <div
                key={h}
                className="flex-1 text-center text-[9px] text-slate-600"
              >
                {h}
              </div>
            ))}
          </div>

          {/* Grid */}
          {grid.map((row, di) => (
            <div key={DAYS[di]} className="flex items-center gap-1 mb-1">
              <span className="w-7 text-[10px] text-slate-500 text-right flex-shrink-0">
                {DAYS[di]}
              </span>
              <div className="flex flex-1 gap-0.5">
                {row.map((val, hi) => {
                  const { bg, opacity } = getColor(val);
                  return (
                    <motion.div
                      key={hi}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.005 * (di * 24 + hi),
                      }}
                      title={`${DAYS[di]} ${HOURS[hi]}: ${val} events`}
                      className="flex-1 rounded-sm cursor-default"
                      style={{
                        height: 18,
                        backgroundColor: bg,
                        opacity,
                        boxShadow: val >= 45 ? `0 0 4px ${bg}80` : undefined,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}

          {/* Scale legend */}
          <div className="flex items-center gap-3 mt-3 ml-8">
            <span className="text-[10px] text-slate-600">Low</span>
            {["#334155", "#22D3EE", "#F59E0B", "#F97316", "#F43F5E"].map(
              (c, i) => (
                <div
                  key={i}
                  className="w-5 h-3 rounded-sm"
                  style={{ backgroundColor: c, opacity: 0.7 }}
                />
              ),
            )}
            <span className="text-[10px] text-slate-600">Critical</span>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
};

export default ActivityHeatmap;
