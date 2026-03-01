const { fetchTransactionContext } = require("../db/fetchContext");
const { callInfer } = require("../ml/client");
const { upsertPredictionAndExplanation } = require("../db/upsertResults");

async function processScanJob(job) {
  const { transactionId } = job.data || {};
  if (!transactionId) throw new Error("Missing transactionId in job payload");

  // 1) Fetch transaction + context from Postgres
  const ctx = await fetchTransactionContext(String(transactionId));
  if (!ctx) throw new Error(`Transaction not found: ${transactionId}`);

  // 2) Call ML with required fields (transaction is REQUIRED by ML)
  const mlPayload = {
    transactionId: String(transactionId),
    transaction: ctx.transaction,                 // ✅ required by ML
    userProfile: ctx.userProfile || null,
    deviceProfile: ctx.deviceProfile || null,
    merchantProfile: ctx.merchantProfile || null,
    recentTransactions: ctx.recentTransactions || [],
  };

  const mlResult = await callInfer(mlPayload);

  // 3) Store results (idempotent UPSERT)
  await upsertPredictionAndExplanation(String(transactionId), mlResult);

  return { ok: true, transactionId: String(transactionId) };
}

module.exports = { processScanJob };