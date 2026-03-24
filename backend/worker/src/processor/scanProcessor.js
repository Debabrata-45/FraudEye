require("dotenv").config({
  path: require("path").join(__dirname, "../../.env"),
});
const { fetchTransactionContext } = require("../db/fetchContext");
const { callInfer } = require("../ml/client");
const { upsertPredictionAndExplanation } = require("../db/upsertResults");
const { pool } = require("../db/pool");
const IORedis = require("ioredis");
const { env } = require("../config/env");

const publisher = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  maxRetriesPerRequest: null,
});

/* ── Build the ContextInput the ML service actually expects ── */
function buildMLContext(ctx) {
  const recent = ctx.recentTransactions || [];
  const userProfile = ctx.userProfile || {};
  const merchantProfile = ctx.merchantProfile || {};

  // Count transactions in last 5 min and 1 hour from the recent list
  const now = Date.now();
  const fiveMin = 5 * 60 * 1000;
  const oneHour = 60 * 60 * 1000;

  const txn_count_5m = recent.filter((r) => {
    const age = now - new Date(r.occurred_at).getTime();
    return age <= fiveMin;
  }).length;

  const txn_count_1h = recent.filter((r) => {
    const age = now - new Date(r.occurred_at).getTime();
    return age <= oneHour;
  }).length;

  // merchant_risk_level: use risk_score from merchants table (1–5 scale)
  // risk_score in DB is 0.0–1.0, map to 1–5
  const rawRisk = parseFloat(merchantProfile.risk_score || 0);
  const merchant_risk_level =
    rawRisk > 0 ? Math.max(1, Math.min(5, Math.ceil(rawRisk * 5))) : 1;

  // known_device_ids: all devices seen in recent transactions for this user
  const known_device_ids = [
    ...new Set(recent.map((r) => r.device_id).filter(Boolean)),
  ];

  // user_stats: avg and std of spend in last 30 days
  const avg_spend_30d = parseFloat(userProfile.avg_amount_30d || 0);

  // Compute std from recent transactions (simple population std)
  let std_spend_30d = 0;
  if (recent.length > 1) {
    const amounts = recent.map((r) => parseFloat(r.amount));
    const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const variance =
      amounts.reduce((s, a) => s + (a - mean) ** 2, 0) / amounts.length;
    std_spend_30d = Math.sqrt(variance);
  }

  // prev_txn: the most recent previous transaction (not the current one)
  // recent[0] is the current transaction (just inserted), so use recent[1]
  let prev_txn = null;
  const prevRow =
    recent.length > 1 ? recent[1] : recent.length === 1 ? null : null;
  if (prevRow) {
    prev_txn = {
      timestamp: prevRow.occurred_at,
      lat: parseFloat(prevRow.geo_lat || 0),
      lon: parseFloat(prevRow.geo_lng || 0),
      deviceId: prevRow.device_id || "unknown",
      merchantId: String(prevRow.merchant_id),
    };
  }

  return {
    txn_count_5m,
    txn_count_1h,
    merchant_risk_level,
    known_device_ids,
    user_stats: {
      avg_spend_30d,
      std_spend_30d: Math.round(std_spend_30d * 100) / 100,
    },
    prev_txn,
  };
}

/* ── Main job processor ──────────────────────────────────── */
async function processScanJob(job) {
  const { transactionId } = job.data || {};
  if (!transactionId) throw new Error("Missing transactionId in job payload");

  // Idempotency — skip if already scored
  const existing = await pool.query(
    `SELECT id FROM transaction_predictions WHERE transaction_id = $1`,
    [String(transactionId)],
  );
  if (existing.rows.length > 0) {
    console.log(`⏭️  Skipping — already scored: ${transactionId}`);
    return { ok: true, skipped: true, transactionId: String(transactionId) };
  }

  const ctx = await fetchTransactionContext(String(transactionId));
  if (!ctx) throw new Error(`Transaction not found: ${transactionId}`);

  // Build correctly-shaped context for ML service
  const mlContext = buildMLContext(ctx);

  const mlPayload = {
    transaction: ctx.transaction,
    context: mlContext,
  };

  const mlResult = await callInfer(mlPayload);
  await upsertPredictionAndExplanation(String(transactionId), mlResult);

  // Publish to Redis → SSE stream
  await publisher.publish(
    "fraudeye:predictions",
    JSON.stringify({
      type: "tx_scored",
      transactionId: String(transactionId),
      riskScore: mlResult.riskScore,
      riskLabel: mlResult.riskLabel,
      fraudProbability: mlResult.fraudProbability,
      topFactors: mlResult.topFactors,
      shap: mlResult.shap,
      lime: mlResult.lime,
      modelVersion: mlResult.modelVersion,
      userId: ctx.transaction.userId,
      merchantId: ctx.transaction.merchantId,
      amount: ctx.transaction.amount,
      timestamp: ctx.transaction.timestamp,
    }),
  );

  console.log(
    `✅ Scored txn ${transactionId}:`,
    `score=${mlResult.riskScore}`,
    `label=${mlResult.riskLabel}`,
    `velocity_5m=${mlContext.txn_count_5m}`,
    `merchant_risk=${mlContext.merchant_risk_level}`,
  );

  return { ok: true, transactionId: String(transactionId) };
}

module.exports = { processScanJob };
