const express = require("express");
const cors = require("cors");
const { pool } = require("./db");
const { txQueue } = require("./modules/queue/queue");
const helmet = require("helmet");
const { env } = require("./config/env");
const { rateLimiter } = require("./middlewares/rateLimit");
const { errorHandler } = require("./middlewares/errorHandler");
const authRoutes = require("./modules/auth/auth.routes");
const txRoutes = require("./modules/transactions/transactions.routes");
const streamRoutes = require("./modules/stream/stream.routes");
const queueRoutes = require("./modules/queue/queue.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");
const feedbackRoutes = require("./modules/feedback/feedback.routes");
const actionsRoutes = require("./modules/actions/actions.routes");
const alertsRoutes = require("./modules/alerts/alerts.routes");
const explanationsRoutes = require("./modules/explanations/explanations.routes");
const auditRoutes = require("./modules/audit/audit.routes");

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(rateLimiter);

const allowedOrigins = (env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes("*")) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", async (req, res) => {
  const health = {
    ok: true,
    service: "fraudeye-backend",
    db: "unknown",
    redis: "unknown",
    timestamp: new Date().toISOString(),
  };
  try {
    await pool.query("SELECT 1");
    health.db = "ok";
  } catch {
    health.db = "error";
    health.ok = false;
  }
  try {
    await txQueue.getJobCounts("waiting");
    health.redis = "ok";
  } catch {
    health.redis = "error";
    health.ok = false;
  }
  res.status(health.ok ? 200 : 503).json(health);
});
app.use("/api/audit-logs", auditRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/actions", actionsRoutes);
app.use("/api/alerts", alertsRoutes);
app.use("/api/explanations", explanationsRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: { message: "Route not found" } });
});

app.use(errorHandler);

module.exports = app;
