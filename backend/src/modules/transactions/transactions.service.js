const { query } = require("../../db");
const { ApiError } = require("../../utils/ApiError");
const { txQueue } = require("../queue/queue");
const { streamHub } = require("../stream/stream.hub");

function labelFromScore(score) {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

async function createTransaction(userId, validated, rawBody) {
  const {
    merchantId, amount, currency, deviceId, ipAddress, geoLat, geoLng, occurredAt,
  } = validated;

  const raw_json = {
    ...rawBody,
    merchantId,
    amount,
    currency,
    deviceId,
    ipAddress,
    geoLat,
    geoLng,
    occurredAt,
  };

  const ins = await query(
    `INSERT INTO transactions
      (user_id, merchant_id, amount, currency, device_id, ip_address, geo_lat, geo_lng, occurred_at, raw_json)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id, created_at`,
    [userId, merchantId, amount, currency, deviceId ?? null, ipAddress ?? null, geoLat ?? null, geoLng ?? null, occurredAt, raw_json]
  );

  const transactionId = ins.rows[0].id;

  // enqueue job with { transactionId } as locked
  await txQueue.add("tx_infer", { transactionId }, { removeOnComplete: 1000, removeOnFail: 5000 });

  // SSE: immediately emit "queued" status (useful for UI)
  streamHub.broadcast({
    type: "tx_status",
    transactionId,
    status: "queued",
    at: new Date().toISOString(),
  });

  return { transactionId };
}

async function listTransactions(q) {
  const limit = Math.min(parseInt(q.limit || "50", 10), 200);
  const offset = Math.max(parseInt(q.offset || "0", 10), 0);

  const filters = [];
  const params = [];
  let idx = 1;

  if (q.riskLabel) {
    filters.push(`p.risk_label = $${idx++}`);
    params.push(q.riskLabel);
  }
  if (q.userId) {
    filters.push(`t.user_id = $${idx++}`);
    params.push(parseInt(q.userId, 10));
  }
  if (q.merchantId) {
    filters.push(`t.merchant_id = $${idx++}`);
    params.push(q.merchantId);
  }

  const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const sql = `
    SELECT
      t.id,
      t.user_id,
      t.merchant_id,
      t.amount,
      t.currency,
      t.occurred_at,
      t.created_at,
      p.risk_score,
      p.risk_label
    FROM transactions t
    LEFT JOIN transaction_predictions p ON p.transaction_id = t.id
    ${where}
    ORDER BY t.occurred_at DESC
    LIMIT ${limit} OFFSET ${offset};
  `;

  const r = await query(sql, params);
  return { items: r.rows, limit, offset };
}

async function getTransactionById(id) {
  const r = await query(
    `SELECT
      t.*,
      p.risk_score, p.risk_label, p.model_version, p.explanation_json
     FROM transactions t
     LEFT JOIN transaction_predictions p ON p.transaction_id = t.id
     WHERE t.id = $1`,
    [id]
  );

  if (!r.rows[0]) throw new ApiError(404, "Transaction not found", "ERR_NOT_FOUND");
  return r.rows[0];
}

module.exports = { createTransaction, listTransactions, getTransactionById, labelFromScore };