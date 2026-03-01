const { env } = require("../config/env");

async function callInfer(payload) {
  const res = await fetch(`${env.ML_SERVICE_URL}/infer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`ML /infer failed: ${res.status} ${text}`);
  }

  return res.json();
}

module.exports = { callInfer };