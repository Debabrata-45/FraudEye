const { env } = require("../config/env");

const ML_TIMEOUT_MS = 15000; // 15 seconds

async function callInfer(payload) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);

  try {
    const res = await fetch(`${env.ML_SERVICE_URL}/infer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`ML /infer failed: ${res.status} ${text}`);
    }

    return res.json();
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`ML /infer timeout after ${ML_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { callInfer };