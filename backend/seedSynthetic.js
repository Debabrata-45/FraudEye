/**
 * seedSynthetic.js — Fixed version matching actual transactions schema
 *
 * Columns: id, user_id, merchant_id, amount, currency,
 *          device_id, ip_address, geo_lat, geo_lng,
 *          occurred_at, raw_json, created_at
 * NO status column.
 */

const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const { Queue } = require("bullmq");

const SEED_COUNT = 500;
const BATCH_SIZE = 25;
const FRAUD_RATIO = 0.45;
const CSV_PATH =
  process.env.CSV_PATH || path.join(__dirname, "data", "sample.csv");

const db = new Pool({
  host: process.env.DB_HOST || "postgres",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "fraudeye_db",
  user: process.env.DB_USER || "fraudeye",
  password: process.env.DB_PASSWORD || "fraudeye_pass",
});

const queue = new Queue("scan_txn_queue", {
  connection: {
    host: process.env.REDIS_HOST || "redis",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
});

/* ── Parse CSV ───────────────────────────────────────────── */
function parseCSV(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim());
  const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

  return lines
    .slice(1)
    .map((line) => {
      const values = [];
      let current = "";
      let inQuotes = false;
      for (const ch of line) {
        if (ch === '"') {
          inQuotes = !inQuotes;
          continue;
        }
        if (ch === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
          continue;
        }
        current += ch;
      }
      values.push(current.trim());
      const row = {};
      headers.forEach((h, i) => {
        row[h] = values[i] ?? "";
      });
      return row;
    })
    .filter((r) => r.amount);
}

/* ── Map CSV row → transactions columns ──────────────────── */
function mapRow(row, userId) {
  const amount = parseFloat(row.amount || row.Amount || "100");
  const currency = (row.currency || row.Currency || "USD")
    .toUpperCase()
    .substring(0, 3);
  const merchantId = (
    row.merchant_id ||
    row.merchantId ||
    "merchant_unknown"
  ).substring(0, 100);
  const deviceId = row.device_id || row.deviceId || null;
  const ipAddress = row.ip_address || row.ipAddress || null;
  const geoLat = parseFloat(row.geo_lat || row.geoLat || "0") || null;
  const geoLng = parseFloat(row.geo_lng || row.geoLng || "0") || null;

  // Spread over last 30 days for realistic timeline
  const daysAgo = Math.floor(Math.random() * 30);
  const hoursAgo = Math.floor(Math.random() * 24);
  const occurredAt = new Date(
    Date.now() - (daysAgo * 86400 + hoursAgo * 3600) * 1000,
  ).toISOString();

  const rawJson = {
    fraud_label: row.fraud_label || row.fraudLabel || "0",
    fraud_reason: row.fraud_reason || row.fraudReason || "",
    source: "synthetic_seed",
  };

  return {
    userId: userId,
    merchantId: merchantId,
    amount: isNaN(amount) ? 100 : Math.abs(amount),
    currency,
    deviceId: deviceId ? deviceId.substring(0, 100) : null,
    ipAddress: ipAddress ? ipAddress.substring(0, 45) : null,
    geoLat: isNaN(geoLat) ? null : geoLat,
    geoLng: isNaN(geoLng) ? null : geoLng,
    occurredAt,
    rawJson: JSON.stringify(rawJson),
  };
}

/* ── Insert one transaction ──────────────────────────────── */
async function insertTransaction(tx) {
  const res = await db.query(
    `INSERT INTO transactions
       (user_id, merchant_id, amount, currency,
        device_id, ip_address, geo_lat, geo_lng,
        occurred_at, raw_json)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING id`,
    [
      tx.userId,
      tx.merchantId,
      tx.amount,
      tx.currency,
      tx.deviceId,
      tx.ipAddress,
      tx.geoLat,
      tx.geoLng,
      tx.occurredAt,
      tx.rawJson,
    ],
  );
  return res.rows[0].id;
}

/* ── Get a valid userId ──────────────────────────────────── */
async function getSeedUserId() {
  const res = await db.query("SELECT id FROM users LIMIT 1");
  if (!res.rows.length) throw new Error("No users in DB");
  return res.rows[0].id;
}

/* ── Main ────────────────────────────────────────────────── */
async function main() {
  console.log("\n🌱 FraudEye Synthetic Seed Script (Fixed)");
  console.log("═══════════════════════════════════════════");

  if (!fs.existsSync(CSV_PATH)) {
    console.error("❌ CSV not found at:", CSV_PATH);
    process.exit(1);
  }

  console.log("📂 Reading CSV from:", CSV_PATH);
  const allRows = parseCSV(CSV_PATH);
  console.log("   Found", allRows.length, "rows");

  const fraudRows = allRows.filter(
    (r) => String(r.fraud_label || r.fraudLabel || "0") === "1",
  );
  const normalRows = allRows.filter(
    (r) => String(r.fraud_label || r.fraudLabel || "0") !== "1",
  );

  const fraudCount = Math.floor(SEED_COUNT * FRAUD_RATIO);
  const normalCount = SEED_COUNT - fraudCount;

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
  const selected = shuffle([
    ...shuffle(fraudRows).slice(0, fraudCount),
    ...shuffle(normalRows).slice(0, normalCount),
  ]);

  console.log("\n📊 Selected", selected.length, "rows");
  console.log("   Fraud (label=1):", Math.min(fraudCount, fraudRows.length));
  console.log("   Normal (label=0):", Math.min(normalCount, normalRows.length));

  const userId = await getSeedUserId();
  console.log("\n👤 Using userId:", userId);
  console.log("\n⚙️  Inserting & queuing in batches of", BATCH_SIZE, "...");

  let inserted = 0;
  let failed = 0;
  const errors = new Set();

  for (let i = 0; i < selected.length; i += BATCH_SIZE) {
    const batch = selected.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(selected.length / BATCH_SIZE);

    process.stdout.write("   Batch " + batchNum + "/" + totalBatches + " ... ");

    for (const row of batch) {
      try {
        const tx = mapRow(row, userId);
        const txId = await insertTransaction(tx);

        await queue.add(
          "scan_transaction",
          { transactionId: txId },
          {
            attempts: 3,
            backoff: { type: "exponential", delay: 2000 },
            removeOnComplete: { count: 100 },
            removeOnFail: { count: 50 },
          },
        );
        inserted++;
      } catch (err) {
        failed++;
        errors.add(err.message);
      }
    }

    console.log("done (" + inserted + " ok, " + failed + " failed)");

    if (i + BATCH_SIZE < selected.length) {
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  if (errors.size) {
    console.log("\n⚠️  Unique errors encountered:");
    errors.forEach((e) => console.log("   -", e));
  }

  console.log("\n═══════════════════════════════════════════");
  console.log("✅ Seeding complete");
  console.log("   Inserted:", inserted);
  console.log("   Failed:  ", failed);

  if (inserted > 0) {
    console.log("\n📡 Worker is now scoring transactions...");
    console.log("   Watch: docker logs fraudeye-worker -f");
    console.log("   Check: curl http://localhost:4000/api/queue/stats");
  }

  console.log("═══════════════════════════════════════════\n");

  await db.end();
  await queue.close();
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Fatal:", err.message);
  process.exit(1);
});
