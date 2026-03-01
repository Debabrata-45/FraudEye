const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { env } = require("./config/env");
const { rateLimiter } = require("./middlewares/rateLimit");
const { errorHandler } = require("./middlewares/errorHandler");

const authRoutes = require("./modules/auth/auth.routes");
const txRoutes = require("./modules/transactions/transactions.routes");
const streamRoutes = require("./modules/stream/stream.routes");
const queueRoutes = require("./modules/queue/queue.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");

const app = express();

app.use(helmet());
app.use(rateLimiter);
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => res.json({ ok: true, service: "fraudeye-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/analytics", analyticsRoutes);

// centralized error handler (must be last)
app.use(errorHandler);

module.exports = { app };