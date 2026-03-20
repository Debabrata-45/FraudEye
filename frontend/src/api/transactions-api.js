/**
 * src/api/transactions.js
 * Real API calls for transactions endpoint
 */
import client from "./client";

export async function fetchTransactions({ limit = 50, offset = 0 } = {}) {
  const res = await client.get("/api/transactions", {
    params: { limit, offset },
  });
  return res.data.data;
}

export async function fetchAnalyticsSummary() {
  const res = await client.get("/api/analytics/summary");
  return res.data.data;
}
