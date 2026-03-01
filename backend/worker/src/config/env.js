function required(name, fallback) {
  const v = process.env[name] ?? fallback;
  if (v === undefined) throw new Error(`Missing env var: ${name}`);
  return v;
}

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  DATABASE_URL: required("DATABASE_URL"),

  REDIS_HOST: required("REDIS_HOST", "redis"),
  REDIS_PORT: parseInt(required("REDIS_PORT", "6379"), 10),

  // ✅ LOCKED
  BULLMQ_QUEUE: required("BULLMQ_QUEUE", "scan_txn_queue"),

  ML_SERVICE_URL: required("ML_SERVICE_URL", "http://ml-service:8000"),

  RECENT_TXN_LIMIT: parseInt(required("RECENT_TXN_LIMIT", "20"), 10),
};

module.exports = { env };