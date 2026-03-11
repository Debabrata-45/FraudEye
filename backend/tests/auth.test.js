const request = require("supertest");

process.env.DATABASE_URL = "postgres://fraudeye:fraudeye_pass@localhost:5433/fraudeye_db";
process.env.JWT_SECRET = "change_me_super_secret";
process.env.JWT_EXPIRES_IN = "12h";
process.env.REDIS_HOST = "localhost";
process.env.REDIS_PORT = "6379";
process.env.BULLMQ_QUEUE = "scan_txn_queue";
process.env.ML_SERVICE_URL = "http://localhost:8000";
process.env.CORS_ORIGIN = "http://localhost:5173";
process.env.PORT = "4001";

const app = require("../src/app");

describe("Auth API", () => {
  test("POST /api/auth/login — success with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "analyst@fraudeye.com", password: "Analyst@12345" });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe("analyst");
  });

  test("POST /api/auth/login — fails with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "analyst@fraudeye.com", password: "wrongpassword" });
    expect(res.status).toBe(401);
    expect(res.body.ok).toBe(false);
  });

  test("POST /api/auth/login — fails with missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "analyst@fraudeye.com" });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  test("GET /health — returns ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

describe("SSE Endpoint", () => {
  test("GET /api/stream/transactions — rejects unauthenticated request", async () => {
    const res = await request(app)
      .get("/api/stream/transactions");
    expect(res.status).toBe(401);
  });
});