// Set env vars before any requires
process.env.DATABASE_URL = "postgres://fraudeye:fraudeye_pass@localhost:5433/fraudeye_db";
process.env.REDIS_HOST = "localhost";
process.env.REDIS_PORT = "6379";
process.env.BULLMQ_QUEUE = "scan_txn_queue";
process.env.ML_SERVICE_URL = "http://localhost:8000";

jest.mock("dotenv", () => ({ config: jest.fn() }));
jest.mock("ioredis", () => jest.fn().mockImplementation(() => ({
  publish: jest.fn().mockResolvedValue(1),
})));
jest.mock("../src/ml/client", () => ({ callInfer: jest.fn() }));
jest.mock("../src/db/pool", () => ({ pool: { query: jest.fn() } }));
jest.mock("../src/db/fetchContext", () => ({ fetchTransactionContext: jest.fn() }));
jest.mock("../src/db/upsertResults", () => ({ upsertPredictionAndExplanation: jest.fn().mockResolvedValue(true) }));

const { callInfer } = require("../src/ml/client");
const { pool } = require("../src/db/pool");
const { fetchTransactionContext } = require("../src/db/fetchContext");
const { processScanJob } = require("../src/processor/scanProcessor");

const MOCK_CONTEXT = {
  transaction: { transactionId: "txn_001", userId: "u1", merchantId: "m1", amount: 5000, timestamp: "2026-03-09T10:00:00Z" },
  context: { merchantRiskLevel: 1, userAvgSpend30d: 3000, userStdSpend30d: 1000, txnVelocity5m: 1, txnVelocity1h: 2, isNewDevice: false, deviceInconsistency: false, geoAnomalyKm: 0, geoImpossible: false, prevLocation: null, prevTimestamp: null, prevDeviceId: null },
};

const MOCK_ML_RESULT = {
  riskScore: 40, riskLabel: "MEDIUM", fraudProbability: 0.4,
  topFactors: [], shap: { values: {} }, lime: { rules: [] }, modelVersion: "xgb_v1",
};

describe("Worker — processScanJob", () => {
  beforeEach(() => jest.clearAllMocks());

  test("throws if transactionId is missing", async () => {
    await expect(processScanJob({ data: {} }))
      .rejects.toThrow("Missing transactionId");
  });

  test("skips if transaction already scored (idempotency)", async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });
    const result = await processScanJob({ data: { transactionId: "txn_001" } });
    expect(result.skipped).toBe(true);
    expect(callInfer).not.toHaveBeenCalled();
    expect(fetchTransactionContext).not.toHaveBeenCalled();
  });

  test("throws if transaction not found in DB", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    fetchTransactionContext.mockResolvedValueOnce(null);
    await expect(processScanJob({ data: { transactionId: "txn_missing" } }))
      .rejects.toThrow("Transaction not found");
  });

  test("processes job successfully", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    fetchTransactionContext.mockResolvedValueOnce(MOCK_CONTEXT);
    callInfer.mockResolvedValueOnce(MOCK_ML_RESULT);
    const result = await processScanJob({ data: { transactionId: "txn_001" } });
    expect(result.ok).toBe(true);
    expect(result.transactionId).toBe("txn_001");
    expect(callInfer).toHaveBeenCalledTimes(1);
  });

  test("throws if ML service fails", async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });
    fetchTransactionContext.mockResolvedValueOnce(MOCK_CONTEXT);
    callInfer.mockRejectedValueOnce(new Error("ML /infer timeout after 15000ms"));
    await expect(processScanJob({ data: { transactionId: "txn_001" } }))
      .rejects.toThrow("ML /infer timeout");
  });
});