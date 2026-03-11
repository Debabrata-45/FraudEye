require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
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

async function processScanJob(job) {
  const { transactionId } = job.data || {};
  if (!transactionId) throw new Error("Missing transactionId in job payload");

  // Idempotency check — skip if already scored
  const existing = await pool.query(
    `SELECT id FROM transaction_predictions WHERE transaction_id = $1`,
    [String(transactionId)]
  );
  if (existing.rows.length > 0) {
    console.log(`⏭️  Skipping job — already scored: ${transactionId}`);
    return { ok: true, skipped: true, transactionId: String(transactionId) };
  }

  const ctx = await fetchTransactionContext(String(transactionId));
  if (!ctx) throw new Error(`Transaction not found: ${transactionId}`);

  const mlPayload = {
    transaction: ctx.transaction,
    context: ctx.context,
  };

  const mlResult = await callInfer(mlPayload);
  await upsertPredictionAndExplanation(String(transactionId), mlResult);

  // Publish result to Redis so backend can broadcast via SSE
  await publisher.publish("fraudeye:predictions", JSON.stringify({
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
  }));

  return { ok: true, transactionId: String(transactionId) };
}

module.exports = { processScanJob };