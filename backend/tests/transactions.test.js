const request = require("supertest");

process.env.DATABASE_URL = "postgres://fraudeye:fraudeye_pass@localhost:5433/fraudeye_db";
process.env.JWT_SECRET = "change_me_super_secret";
process.env.JWT_EXPIRES_IN = "12h";
process.env.REDIS_HOST = "localhost";
process.env.REDIS_PORT = "6379";
process.env.BULLMQ_QUEUE = "scan_txn_queue";
process.env.ML_SERVICE_URL = "http://localhost:8000";
process.env.PORT = "4002";

const app = require("../src/app");

let token;

beforeAll(async () => {
  const res = await request(app)
    .post("/api/auth/login")
    .send({ email: "analyst@fraudeye.com", password: "Analyst@12345" });
  token = res.body.data.token;
});

describe("Transactions API", () => {
  test("POST /api/transactions — rejects unauthenticated request", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .send({ transactionId: "test_001", amount: 100 });

    expect(res.status).toBe(401);
  });

  test("POST /api/transactions — rejects invalid payload", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({ transactionId: "test_001" }); // missing required fields

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  test("POST /api/transactions — accepts valid payload", async () => {
    const res = await request(app)
      .post("/api/transactions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        transactionId: `test_jest_${Date.now()}`,
        userId: "user_jest_01",
        merchantId: "merch_001",
        amount: 500,
        currency: "INR",
        deviceId: "device_jest_01",
        ipAddress: "192.168.1.1",
        geoLat: 28.6139,
        geoLng: 77.2090,
        occurredAt: "2026-03-09T10:00:00Z",
      });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
  });
});