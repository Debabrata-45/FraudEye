function required(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var: ${name}`);
  return v;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(required("PORT", "4000"), 10),

  CORS_ORIGIN: required("CORS_ORIGIN", "http://localhost:5173"),

  JWT_SECRET: required("JWT_SECRET"),
  JWT_EXPIRES_IN: required("JWT_EXPIRES_IN", "12h"),

  DATABASE_URL: required("DATABASE_URL"),

  // Keep host/port style (works in Docker + local)
  REDIS_HOST: required("REDIS_HOST", "localhost"),
  REDIS_PORT: parseInt(required("REDIS_PORT", "6379"), 10),

  // ✅ LOCKED queue name
  BULLMQ_QUEUE: required("BULLMQ_QUEUE", "scan_txn_queue"),

  // Backend may not directly call ML in Phase 3, but keep it if you use it elsewhere
  ML_SERVICE_URL: required("ML_SERVICE_URL", "http://localhost:8000"),
};

module.exports = { env };