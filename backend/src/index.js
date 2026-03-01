require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const { rateLimiter } = require("./middlewares/rateLimit");
const { errorHandler } = require("./middlewares/errorHandler");

// Routes
const authRoutes = require("./modules/auth/auth.routes");
const txRoutes = require("./modules/transactions/transactions.routes");
const streamRoutes = require("./modules/stream/stream.routes");
const queueRoutes = require("./modules/queue/queue.routes");
const analyticsRoutes = require("./modules/analytics/analytics.routes");

const app = express();

/**
 * If you deploy behind a reverse proxy (Nginx/Render/etc.),
 * this helps Express get the correct IP (important for rate limiting).
 * Safe to keep even in local dev.
 */
app.set("trust proxy", 1);

/** Security + basic hardening */
app.use(helmet());
app.use(rateLimiter);

/** CORS */
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman/curl/server-to-server)
      if (!origin) return callback(null, true);

      // Allow wildcard
      if (allowedOrigins.includes("*")) return callback(null, true);

      // Allow if in list
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

/** Body parsing */
app.use(express.json({ limit: "1mb" }));

/** Health */
app.get("/health", (req, res) =>
  res.json({ ok: true, service: "fraudeye-backend" })
);

/** Phase 2 routes */
app.use("/api/auth", authRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/analytics", analyticsRoutes);

/** 404 fallback */
app.use((req, res) => {
  res.status(404).json({ ok: false, error: { message: "Route not found" } });
});

/** Centralized error handler (must be last) */
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () =>
  console.log(`🚀 FraudEye Backend running on port ${PORT}`)
);