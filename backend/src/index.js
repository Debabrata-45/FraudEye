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
const feedbackRoutes = require("./modules/feedback/feedback.routes");
const actionsRoutes = require("./modules/actions/actions.routes");

const app = express();

app.set("trust proxy", 1);

app.use(helmet());
app.use(rateLimiter);

const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
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
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) =>
  res.json({ ok: true, service: "fraudeye-backend" })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", txRoutes);
app.use("/api/stream", streamRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/actions", actionsRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, error: { message: "Route not found" } });
});

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () =>
  console.log(`🚀 FraudEye Backend running on port ${PORT}`)
);