const { Pool } = require("pg");
const { Queue } = require("bullmq");

const db = new Pool({
  host: "postgres",
  port: 5432,
  database: "fraudeye_db",
  user: "fraudeye",
  password: "fraudeye_pass",
});

const queue = new Queue("scan_txn_queue", {
  connection: { host: "redis", port: 6379 },
});

const fraudTxns = [
  {
    merchant_id: "crypto_exchange_unknown",
    amount: 950000,
    currency: "INR",
    geo_lat: 55.75,
    geo_lng: 37.61,
    device_id: "unknown_device_001",
    ip_address: "185.220.101.5",
  },
  {
    merchant_id: "offshore_casino_vip",
    amount: 750000,
    currency: "INR",
    geo_lat: 1.35,
    geo_lng: 103.82,
    device_id: "unknown_device_002",
    ip_address: "185.220.101.6",
  },
  {
    merchant_id: "crypto_exchange_unknown",
    amount: 480000,
    currency: "INR",
    geo_lat: 55.75,
    geo_lng: 37.61,
    device_id: "unknown_device_003",
    ip_address: "45.142.212.100",
  },
  {
    merchant_id: "hawala_transfer_co",
    amount: 1200000,
    currency: "INR",
    geo_lat: 25.2,
    geo_lng: 55.27,
    device_id: "unknown_device_004",
    ip_address: "185.220.101.7",
  },
  {
    merchant_id: "offshore_casino_vip",
    amount: 320000,
    currency: "INR",
    geo_lat: 1.35,
    geo_lng: 103.82,
    device_id: "unknown_device_005",
    ip_address: "45.142.212.101",
  },
  {
    merchant_id: "crypto_exchange_unknown",
    amount: 870000,
    currency: "INR",
    geo_lat: 55.75,
    geo_lng: 37.61,
    device_id: "unknown_device_006",
    ip_address: "185.220.101.8",
  },
  {
    merchant_id: "hawala_transfer_co",
    amount: 990000,
    currency: "INR",
    geo_lat: 51.51,
    geo_lng: -0.13,
    device_id: "unknown_device_007",
    ip_address: "45.142.212.102",
  },
  {
    merchant_id: "darkweb_marketplace",
    amount: 560000,
    currency: "INR",
    geo_lat: 37.77,
    geo_lng: -122.42,
    device_id: "unknown_device_008",
    ip_address: "185.220.101.9",
  },
  {
    merchant_id: "crypto_exchange_unknown",
    amount: 430000,
    currency: "INR",
    geo_lat: 55.75,
    geo_lng: 37.61,
    device_id: "unknown_device_009",
    ip_address: "185.220.101.10",
  },
  {
    merchant_id: "offshore_casino_vip",
    amount: 680000,
    currency: "INR",
    geo_lat: 1.35,
    geo_lng: 103.82,
    device_id: "unknown_device_010",
    ip_address: "45.142.212.103",
  },
  {
    merchant_id: "hawala_transfer_co",
    amount: 1500000,
    currency: "INR",
    geo_lat: 25.2,
    geo_lng: 55.27,
    device_id: "unknown_device_011",
    ip_address: "185.220.101.11",
  },
  {
    merchant_id: "darkweb_marketplace",
    amount: 290000,
    currency: "INR",
    geo_lat: 37.77,
    geo_lng: -122.42,
    device_id: "unknown_device_012",
    ip_address: "45.142.212.104",
  },
  {
    merchant_id: "crypto_exchange_unknown",
    amount: 1100000,
    currency: "INR",
    geo_lat: 55.75,
    geo_lng: 37.61,
    device_id: "unknown_device_013",
    ip_address: "185.220.101.12",
  },
  {
    merchant_id: "offshore_casino_vip",
    amount: 440000,
    currency: "INR",
    geo_lat: 1.35,
    geo_lng: 103.82,
    device_id: "unknown_device_014",
    ip_address: "45.142.212.105",
  },
  {
    merchant_id: "hawala_transfer_co",
    amount: 780000,
    currency: "INR",
    geo_lat: 25.2,
    geo_lng: 55.27,
    device_id: "unknown_device_015",
    ip_address: "185.220.101.13",
  },
  {
    merchant_id: "darkweb_marketplace",
    amount: 920000,
    currency: "INR",
    geo_lat: 37.77,
    geo_lng: -122.42,
    device_id: "unknown_device_016",
    ip_address: "45.142.212.106",
  },
  {
    merchant_id: "crypto_exchange_unknown",
    amount: 350000,
    currency: "INR",
    geo_lat: 55.75,
    geo_lng: 37.61,
    device_id: "unknown_device_017",
    ip_address: "185.220.101.14",
  },
  {
    merchant_id: "hawala_transfer_co",
    amount: 660000,
    currency: "INR",
    geo_lat: 25.2,
    geo_lng: 55.27,
    device_id: "unknown_device_018",
    ip_address: "45.142.212.107",
  },
  {
    merchant_id: "darkweb_marketplace",
    amount: 1300000,
    currency: "INR",
    geo_lat: 37.77,
    geo_lng: -122.42,
    device_id: "unknown_device_019",
    ip_address: "185.220.101.15",
  },
  {
    merchant_id: "crypto_exchange_unknown",
    amount: 510000,
    currency: "INR",
    geo_lat: 55.75,
    geo_lng: 37.61,
    device_id: "unknown_device_020",
    ip_address: "45.142.212.108",
  },
];

async function run() {
  const userRes = await db.query("SELECT id FROM users LIMIT 1");
  const userId = userRes.rows[0].id;
  let ok = 0;

  for (const t of fraudTxns) {
    const res = await db.query(
      "INSERT INTO transactions (user_id, merchant_id, amount, currency, geo_lat, geo_lng, device_id, ip_address, occurred_at, raw_json) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id",
      [
        userId,
        t.merchant_id,
        t.amount,
        t.currency,
        t.geo_lat,
        t.geo_lng,
        t.device_id,
        t.ip_address,
        new Date().toISOString(),
        JSON.stringify({ source: "fraud_seed", fraud_label: "1" }),
      ],
    );
    const txId = res.rows[0].id;
    await queue.add(
      "scan_transaction",
      { transactionId: txId },
      { attempts: 3, backoff: { type: "exponential", delay: 2000 } },
    );
    ok++;
    console.log(
      "Queued txId:",
      txId,
      "| merchant:",
      t.merchant_id,
      "| amount:",
      t.amount,
    );
  }

  console.log("\n✅ Done. Queued", ok, "high-fraud transactions");
  console.log("   Watch worker: docker logs fraudeye-worker -f");
  await db.end();
  await queue.close();
}

run().catch((e) => {
  console.error("❌", e.message);
  process.exit(1);
});
